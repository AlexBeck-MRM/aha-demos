import {
  blurFragmentSource,
  flameFragmentSource,
  FRAME_RATE,
  SHARED_BLUR_RADIUS,
  SOURCE_SIZE,
  STATIC_PHASE_SECONDS,
  vertexShaderSource
} from "./shaders";
import type { LivingGradientTargetOptions } from "./types";

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type TargetRecord = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  interactionHost: HTMLElement | null;
  context: CanvasRenderingContext2D | null;
  options: Required<LivingGradientTargetOptions>;
  visible: boolean;
  nearViewport: boolean;
  hovered: boolean;
  focused: boolean;
  cleanupEvents: () => void;
};

type RuntimeSnapshot = {
  contextCount: number;
  sourceCanvasCount: number;
  targetCount: number;
  activeTargetCount: number;
  frameCount: number;
  renderedFps: number;
  copyP95Ms: number;
  reducedMotion: boolean;
  running: boolean;
  status: string;
};

declare global {
  interface Window {
    __ahaLivingGradient?: {
      snapshot: () => RuntimeSnapshot;
      renderPhase: (seconds: number) => boolean;
      sampleWhiteContrast: (seconds: number, veilOpacity: number) => number | null;
      loseContext: () => boolean;
    };
  }
}

const FRAME_INTERVAL = 1000 / FRAME_RATE;
const DEEP_RED = [82, 2, 8] as const;

function defaultOptions(options: LivingGradientTargetOptions): Required<LivingGradientTargetOptions> {
  return {
    behavior: options.behavior,
    enabled: options.enabled ?? true,
    tone: options.tone ?? "text"
  };
}

function isDisabled(element: HTMLElement | null) {
  if (!element) return false;
  return element.matches(":disabled, [aria-disabled='true']");
}

function percentile(values: number[], percentileValue: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * percentileValue))];
}

function linearChannel(value: number) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function whiteContrast(red: number, green: number, blue: number) {
  const luminance = 0.2126 * linearChannel(red) + 0.7152 * linearChannel(green) + 0.0722 * linearChannel(blue);
  return 1.05 / (luminance + 0.05);
}

class SharedFlameRenderer {
  readonly gl: WebGLRenderingContext;
  private readonly flameProgram: WebGLProgram;
  private readonly blurProgram: WebGLProgram;
  private readonly buffer: WebGLBuffer;
  private readonly sceneTexture: WebGLTexture;
  private readonly blurTexture: WebGLTexture;
  private readonly sceneFramebuffer: WebGLFramebuffer;
  private readonly blurFramebuffer: WebGLFramebuffer;
  private readonly flamePosition: number;
  private readonly blurPosition: number;
  private readonly timeUniform: WebGLUniformLocation;
  private readonly blurTextureUniform: WebGLUniformLocation;
  private readonly blurResolutionUniform: WebGLUniformLocation;
  private readonly blurDirectionUniform: WebGLUniformLocation;
  private readonly blurRadiusUniform: WebGLUniformLocation;

  constructor(private readonly canvas: HTMLCanvasElement) {
    canvas.width = SOURCE_SIZE;
    canvas.height = SOURCE_SIZE;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power"
    });
    if (!gl) throw new Error("WebGL1 is unavailable.");
    this.gl = gl;
    this.flameProgram = this.createProgram(flameFragmentSource);
    this.blurProgram = this.createProgram(blurFragmentSource);
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error("Could not allocate the shared shader buffer.");
    this.buffer = buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    this.flamePosition = gl.getAttribLocation(this.flameProgram, "a_position");
    this.blurPosition = gl.getAttribLocation(this.blurProgram, "a_position");
    const timeUniform = gl.getUniformLocation(this.flameProgram, "u_time");
    const blurTextureUniform = gl.getUniformLocation(this.blurProgram, "u_texture");
    const blurResolutionUniform = gl.getUniformLocation(this.blurProgram, "u_resolution");
    const blurDirectionUniform = gl.getUniformLocation(this.blurProgram, "u_direction");
    const blurRadiusUniform = gl.getUniformLocation(this.blurProgram, "u_radius");
    if (!timeUniform || !blurTextureUniform || !blurResolutionUniform || !blurDirectionUniform || !blurRadiusUniform) {
      throw new Error("Could not resolve shared shader uniforms.");
    }
    this.timeUniform = timeUniform;
    this.blurTextureUniform = blurTextureUniform;
    this.blurResolutionUniform = blurResolutionUniform;
    this.blurDirectionUniform = blurDirectionUniform;
    this.blurRadiusUniform = blurRadiusUniform;

    this.sceneTexture = this.createTexture();
    this.blurTexture = this.createTexture();
    this.sceneFramebuffer = this.createFramebuffer(this.sceneTexture);
    this.blurFramebuffer = this.createFramebuffer(this.blurTexture);
  }

  render(seconds: number) {
    const gl = this.gl;
    gl.viewport(0, 0, SOURCE_SIZE, SOURCE_SIZE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFramebuffer);
    gl.useProgram(this.flameProgram);
    this.bindPosition(this.flamePosition);
    gl.uniform1f(this.timeUniform, seconds);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.drawBlur(this.sceneTexture, this.blurFramebuffer, 1, 0);
    this.drawBlur(this.blurTexture, null, 0, 1);
    gl.flush();
  }

  readPixels() {
    const pixels = new Uint8Array(SOURCE_SIZE * SOURCE_SIZE * 4);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.readPixels(0, 0, SOURCE_SIZE, SOURCE_SIZE, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
    return pixels;
  }

  loseContext() {
    const extension = this.gl.getExtension("WEBGL_lose_context");
    if (!extension) return false;
    extension.loseContext();
    return true;
  }

  destroy() {
    const gl = this.gl;
    gl.deleteFramebuffer(this.sceneFramebuffer);
    gl.deleteFramebuffer(this.blurFramebuffer);
    gl.deleteTexture(this.sceneTexture);
    gl.deleteTexture(this.blurTexture);
    gl.deleteBuffer(this.buffer);
    gl.deleteProgram(this.flameProgram);
    gl.deleteProgram(this.blurProgram);
  }

  private drawBlur(texture: WebGLTexture, framebuffer: WebGLFramebuffer | null, directionX: number, directionY: number) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.useProgram(this.blurProgram);
    this.bindPosition(this.blurPosition);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(this.blurTextureUniform, 0);
    gl.uniform2f(this.blurResolutionUniform, SOURCE_SIZE, SOURCE_SIZE);
    gl.uniform2f(this.blurDirectionUniform, directionX, directionY);
    gl.uniform1f(this.blurRadiusUniform, SHARED_BLUR_RADIUS);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private bindPosition(location: number) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  }

  private createProgram(fragmentSource: string) {
    const gl = this.gl;
    const vertex = this.compile(gl.VERTEX_SHADER, vertexShaderSource);
    const fragment = this.compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!program) throw new Error("Could not allocate a shared shader program.");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    const log = gl.getProgramInfoLog(program);
    gl.detachShader(program, vertex);
    gl.detachShader(program, fragment);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!linked) {
      gl.deleteProgram(program);
      throw new Error(log || "Could not link the shared shader program.");
    }
    return program;
  }

  private compile(type: number, source: string) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not allocate a shared shader.");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(log || "Could not compile the shared shader.");
    }
    return shader;
  }

  private createTexture() {
    const gl = this.gl;
    const texture = gl.createTexture();
    if (!texture) throw new Error("Could not allocate a shared shader texture.");
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SOURCE_SIZE, SOURCE_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return texture;
  }

  private createFramebuffer(texture: WebGLTexture) {
    const gl = this.gl;
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) throw new Error("Could not allocate a shared shader framebuffer.");
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("The shared shader framebuffer is incomplete.");
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return framebuffer;
  }
}

export class LivingGradientRuntime {
  private readonly targets = new Map<HTMLCanvasElement, TargetRecord>();
  private renderer: SharedFlameRenderer | null = null;
  private started = false;
  private contextLost = false;
  private manualReducedMotion = false;
  private systemReducedMotion = false;
  private documentVisible = !document.hidden;
  private frameRequest = 0;
  private idleRequest = 0;
  private lastFrameAt = 0;
  private origin = performance.now();
  private frameCount = 0;
  private frameTimes: number[] = [];
  private copyDurations: number[] = [];
  private status = "idle";
  private visibilityObserver: IntersectionObserver | null = null;
  private preloadObserver: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private reducedMotionQuery: MediaQueryList | null = null;
  private finePointerQuery: MediaQueryList | null = null;

  constructor(private readonly sourceCanvas: HTMLCanvasElement) {}

  start() {
    if (this.started) return;
    this.started = true;
    this.visibilityObserver = new IntersectionObserver(this.handleVisibility, { threshold: 0.01 });
    this.preloadObserver = new IntersectionObserver(this.handlePreload, { rootMargin: "300px" });
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    this.systemReducedMotion = this.reducedMotionQuery.matches;
    this.reducedMotionQuery.addEventListener("change", this.handleReducedMotionChange);
    document.addEventListener("visibilitychange", this.handleDocumentVisibility);
    this.sourceCanvas.addEventListener("webglcontextlost", this.handleContextLost);
    this.sourceCanvas.addEventListener("webglcontextrestored", this.handleContextRestored);
    this.targets.forEach((target) => this.observeTarget(target));
    this.installDiagnostics();
  }

  destroy() {
    if (!this.started) return;
    this.started = false;
    this.cancelLoop();
    this.cancelIdleInitialization();
    this.visibilityObserver?.disconnect();
    this.preloadObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.reducedMotionQuery?.removeEventListener("change", this.handleReducedMotionChange);
    document.removeEventListener("visibilitychange", this.handleDocumentVisibility);
    this.sourceCanvas.removeEventListener("webglcontextlost", this.handleContextLost);
    this.sourceCanvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
    this.targets.forEach((target) => target.cleanupEvents());
    this.targets.clear();
    this.renderer?.destroy();
    this.renderer = null;
    if (window.__ahaLivingGradient?.snapshot === this.getSnapshot) delete window.__ahaLivingGradient;
  }

  register(canvas: HTMLCanvasElement, options: LivingGradientTargetOptions) {
    const host = canvas.parentElement;
    if (!host) return () => undefined;
    const target: TargetRecord = {
      canvas,
      host,
      interactionHost: canvas.closest<HTMLElement>(".interactive"),
      context: canvas.getContext("2d", { alpha: false }),
      options: defaultOptions(options),
      visible: false,
      nearViewport: false,
      hovered: false,
      focused: false,
      cleanupEvents: () => undefined
    };
    target.cleanupEvents = this.bindInteractionEvents(target);
    this.targets.set(canvas, target);
    if (!target.context) canvas.dataset.gradientStatus = "fallback";
    if (this.started) this.observeTarget(target);
    this.resizeTarget(target, host.getBoundingClientRect());
    this.syncTargetState(target);
    return () => this.unregister(canvas);
  }

  update(canvas: HTMLCanvasElement, options: LivingGradientTargetOptions) {
    const target = this.targets.get(canvas);
    if (!target) return;
    target.options = defaultOptions(options);
    if (!target.options.enabled) {
      target.hovered = false;
      target.focused = false;
    }
    this.syncTargetState(target);
    this.syncLoop();
  }

  setManualReducedMotion(value: boolean) {
    if (this.manualReducedMotion === value) return;
    this.manualReducedMotion = value;
    this.handleMotionModeChange();
  }

  private unregister(canvas: HTMLCanvasElement) {
    const target = this.targets.get(canvas);
    if (!target) return;
    target.cleanupEvents();
    this.visibilityObserver?.unobserve(target.host);
    this.preloadObserver?.unobserve(target.host);
    this.resizeObserver?.unobserve(target.host);
    this.targets.delete(canvas);
    this.syncLoop();
  }

  private observeTarget(target: TargetRecord) {
    this.visibilityObserver?.observe(target.host);
    this.preloadObserver?.observe(target.host);
    this.resizeObserver?.observe(target.host);
  }

  private bindInteractionEvents(target: TargetRecord) {
    if (target.options.behavior !== "interaction" || !target.interactionHost) return () => undefined;
    const host = target.interactionHost;
    // No pointer-down/up state: pressing must not change gradient activation beyond hover or focus.
    const onPointerEnter = () => {
      if (!this.isFinePointer() || isDisabled(host)) return;
      target.hovered = true;
      this.activateTarget(target);
    };
    const onPointerLeave = () => {
      target.hovered = false;
      this.syncTargetState(target);
      this.syncLoop();
    };
    const syncFocus = () => {
      target.focused = !isDisabled(host) && (host.matches(":focus-visible") || Boolean(host.querySelector(":focus-visible")));
      if (target.focused) this.activateTarget(target);
      else {
        this.syncTargetState(target);
        this.syncLoop();
      }
    };
    host.addEventListener("pointerenter", onPointerEnter);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("focusin", syncFocus);
    host.addEventListener("focusout", syncFocus);
    return () => {
      host.removeEventListener("pointerenter", onPointerEnter);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("focusin", syncFocus);
      host.removeEventListener("focusout", syncFocus);
    };
  }

  private activateTarget(target: TargetRecord) {
    this.syncTargetState(target);
    if (!this.renderer) this.ensureRenderer();
    if (this.reducedMotion) this.renderAndCopy(STATIC_PHASE_SECONDS);
    this.syncLoop();
  }

  private syncTargetState(target: TargetRecord) {
    const active = this.isTargetActive(target);
    target.canvas.dataset.gradientActive = String(active);
    target.canvas.dataset.gradientBehavior = target.options.behavior;
    target.canvas.dataset.gradientTone = target.options.tone;
    if (!active) target.canvas.dataset.gradientReady = "false";
  }

  private isTargetActive(target: TargetRecord) {
    if (!target.options.enabled || !target.context) return false;
    if (target.options.behavior === "persistent") return target.visible;
    return target.hovered || target.focused;
  }

  private get activeTargets() {
    return [...this.targets.values()].filter((target) => this.isTargetActive(target));
  }

  private get reducedMotion() {
    return this.manualReducedMotion || this.systemReducedMotion;
  }

  private ensureRenderer() {
    if (this.renderer || this.contextLost || !this.started) return Boolean(this.renderer);
    const startedAt = performance.now();
    try {
      this.renderer = new SharedFlameRenderer(this.sourceCanvas);
      this.status = "ready";
      this.sourceCanvas.dataset.gradientStatus = "ready";
      this.origin = performance.now();
      this.renderAndCopy(this.reducedMotion ? STATIC_PHASE_SECONDS : 0);
      this.sourceCanvas.dataset.gradientInitMs = (performance.now() - startedAt).toFixed(2);
      return true;
    } catch (error) {
      this.status = "fallback";
      this.sourceCanvas.dataset.gradientStatus = "fallback";
      console.warn("Living gradient is using its CSS fallback.", error);
      this.targets.forEach((target) => {
        target.canvas.dataset.gradientReady = "false";
        target.canvas.dataset.gradientStatus = "fallback";
      });
      return false;
    }
  }

  private scheduleInitialization() {
    if (this.renderer || this.idleRequest || this.contextLost || !this.started) return;
    const idleWindow = window as IdleWindow;
    if (idleWindow.requestIdleCallback) {
      this.idleRequest = idleWindow.requestIdleCallback(() => {
        this.idleRequest = 0;
        this.ensureRenderer();
        this.syncLoop();
      }, { timeout: 120 });
      return;
    }
    this.idleRequest = window.setTimeout(() => {
      this.idleRequest = 0;
      this.ensureRenderer();
      this.syncLoop();
    }, 0);
  }

  private cancelIdleInitialization() {
    if (!this.idleRequest) return;
    const idleWindow = window as IdleWindow;
    if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(this.idleRequest);
    else window.clearTimeout(this.idleRequest);
    this.idleRequest = 0;
  }

  private syncLoop() {
    const shouldRun = Boolean(this.renderer && !this.reducedMotion && this.documentVisible && this.activeTargets.length);
    if (!shouldRun) {
      this.cancelLoop();
      return;
    }
    if (this.frameRequest) return;
    this.frameRequest = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.frameRequest = 0;
    const elapsed = now - this.lastFrameAt;
    if (elapsed >= FRAME_INTERVAL) {
      this.lastFrameAt = now - (elapsed % FRAME_INTERVAL);
      this.renderAndCopy((now - this.origin) / 1000);
    }
    this.syncLoop();
  };

  private cancelLoop() {
    if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
    this.frameRequest = 0;
  }

  private renderAndCopy(seconds: number) {
    if (!this.renderer || this.contextLost) return false;
    this.renderer.render(seconds);
    const copyStarted = performance.now();
    this.activeTargets.forEach((target) => {
      if (!target.context || target.canvas.width < 1 || target.canvas.height < 1) return;
      target.context.imageSmoothingEnabled = true;
      target.context.imageSmoothingQuality = "high";
      target.context.drawImage(this.sourceCanvas, 0, 0, SOURCE_SIZE, SOURCE_SIZE, 0, 0, target.canvas.width, target.canvas.height);
      target.canvas.dataset.gradientReady = "true";
      target.canvas.dataset.gradientStatus = "ready";
    });
    const completedAt = performance.now();
    this.copyDurations.push(completedAt - copyStarted);
    this.frameTimes.push(completedAt);
    this.copyDurations = this.copyDurations.slice(-300);
    this.frameTimes = this.frameTimes.filter((time) => completedAt - time <= 10_000);
    this.frameCount += 1;
    return true;
  }

  private resizeTarget(target: TargetRecord, rect: Pick<DOMRectReadOnly, "width" | "height">) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (target.canvas.width === width && target.canvas.height === height) return;
    target.canvas.width = width;
    target.canvas.height = height;
    target.canvas.dataset.gradientReady = "false";
    if (this.isTargetActive(target)) {
      if (this.renderer) this.renderAndCopy(this.reducedMotion ? STATIC_PHASE_SECONDS : (performance.now() - this.origin) / 1000);
      else this.scheduleInitialization();
    }
  }

  private handleVisibility: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const target = [...this.targets.values()].find((candidate) => candidate.host === entry.target);
      if (!target) return;
      target.visible = entry.isIntersecting;
      this.syncTargetState(target);
      if (target.visible && target.options.enabled) {
        if (this.renderer) this.renderAndCopy(this.reducedMotion ? STATIC_PHASE_SECONDS : (performance.now() - this.origin) / 1000);
        else this.scheduleInitialization();
      }
    });
    this.syncLoop();
  };

  private handlePreload: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const target = [...this.targets.values()].find((candidate) => candidate.host === entry.target);
      if (!target) return;
      target.nearViewport = entry.isIntersecting;
      if (target.nearViewport && target.options.enabled) this.scheduleInitialization();
    });
  };

  private handleResize: ResizeObserverCallback = (entries) => {
    entries.forEach((entry) => {
      this.targets.forEach((target) => {
        if (target.host === entry.target) this.resizeTarget(target, entry.contentRect);
      });
    });
  };

  private handleReducedMotionChange = (event: MediaQueryListEvent) => {
    this.systemReducedMotion = event.matches;
    this.handleMotionModeChange();
  };

  private handleMotionModeChange() {
    if (this.reducedMotion) {
      this.cancelLoop();
      if (this.renderer) this.renderAndCopy(STATIC_PHASE_SECONDS);
      else if (this.activeTargets.length) this.scheduleInitialization();
    } else {
      this.origin = performance.now();
      this.lastFrameAt = 0;
      this.syncLoop();
    }
  }

  private handleDocumentVisibility = () => {
    this.documentVisible = !document.hidden;
    this.syncLoop();
  };

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.contextLost = true;
    this.status = "context-lost";
    this.cancelLoop();
    this.renderer = null;
    this.targets.forEach((target) => {
      target.canvas.dataset.gradientReady = "false";
      target.canvas.dataset.gradientStatus = "fallback";
    });
  };

  private handleContextRestored = () => {
    this.contextLost = false;
    this.status = "restoring";
    if (this.activeTargets.length) this.ensureRenderer();
    this.syncLoop();
  };

  private isFinePointer() {
    return this.finePointerQuery?.matches ?? false;
  }

  private getSnapshot = (): RuntimeSnapshot => ({
    contextCount: this.renderer ? 1 : 0,
    sourceCanvasCount: document.querySelectorAll("canvas[data-living-gradient-source]").length,
    targetCount: this.targets.size,
    activeTargetCount: this.activeTargets.length,
    frameCount: this.frameCount,
    renderedFps: this.frameTimes.length / 10,
    copyP95Ms: percentile(this.copyDurations, 0.95),
    reducedMotion: this.reducedMotion,
    running: Boolean(this.frameRequest),
    status: this.status
  });

  private installDiagnostics() {
    window.__ahaLivingGradient = {
      snapshot: this.getSnapshot,
      renderPhase: (seconds) => {
        if (!this.ensureRenderer()) return false;
        return this.renderAndCopy(seconds);
      },
      sampleWhiteContrast: (seconds, veilOpacity) => {
        if (!this.ensureRenderer() || !this.renderer) return null;
        this.renderer.render(seconds);
        const pixels = this.renderer.readPixels();
        let minimum = Number.POSITIVE_INFINITY;
        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index] * (1 - veilOpacity) + DEEP_RED[0] * veilOpacity;
          const green = pixels[index + 1] * (1 - veilOpacity) + DEEP_RED[1] * veilOpacity;
          const blue = pixels[index + 2] * (1 - veilOpacity) + DEEP_RED[2] * veilOpacity;
          minimum = Math.min(minimum, whiteContrast(red, green, blue));
        }
        return minimum;
      },
      loseContext: () => this.renderer?.loseContext() ?? false
    };
  }
}
