import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { createKenBurnsMotion, getBleed } from "../KenBurnsSlideshow";
import styles from "./SpatialScrollStory.module.css";
import type {
  ForegroundSectionProps,
  ParallaxBackdropSectionProps,
  ParallaxImageSectionProps,
  ScrollRevealGroupProps,
  ScrollRevealTitleProps,
  SpatialMotionSettings,
  SpatialScrollStoryProps,
} from "./types";
import { useScrollScene } from "./useScrollScene";

type StoryContextValue = {
  settings: SpatialMotionSettings;
  ambientPaused: boolean;
  reducedMotion: boolean;
};

type SpatialCSSProperties = CSSProperties & Record<`--ss-${string}`, string | number>;

const StoryContext = createContext<StoryContextValue | null>(null);

function useStoryContext() {
  const context = useContext(StoryContext);
  if (!context) throw new Error("Spatial scroll components must be placed inside SpatialScrollStory.");
  return context;
}

function usePrefersReducedMotion() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return matches;
}

export function SpatialScrollStory({
  settings,
  ambientPaused = false,
  forceReducedMotion = false,
  children,
  className,
  style,
  ...props
}: SpatialScrollStoryProps) {
  const systemReducedMotion = usePrefersReducedMotion();
  const reducedMotion = forceReducedMotion || systemReducedMotion;
  const value = useMemo(
    () => ({ settings, ambientPaused, reducedMotion }),
    [ambientPaused, reducedMotion, settings],
  );
  const titleBlurGuard = Math.max(settings.titleBlurInPx, settings.titleBlurOutPx);
  const titleScaleGuard = Math.max(
    0,
    settings.titleScaleOut - 1,
    settings.surfaceTitleScaleIn - 1,
  ) * 50;
  // These guards are derived, not authored parameters: they reserve the paint envelope created
  // by blur and scale so glyphs (especially descenders) cannot be clipped at the viewport edge.
  const rootStyle = {
    ...style,
    "--ss-sheet-radius": `${settings.sheetRadiusPx}px`,
    "--ss-shade-opacity": settings.shadeOpacity,
    "--ss-title-travel": `${settings.titleTravelPx}px`,
    "--ss-title-scale-in": settings.titleScaleIn,
    "--ss-title-scale-out": settings.titleScaleOut,
    "--ss-surface-title-scale-in": settings.surfaceTitleScaleIn,
    "--ss-title-blur-in": `${settings.titleBlurInPx}px`,
    "--ss-title-blur-out": `${settings.titleBlurOutPx}px`,
    "--ss-title-blur-guard": `${titleBlurGuard}px`,
    "--ss-title-scale-guard": `${titleScaleGuard}%`,
    "--ss-ambient-duration": `${settings.kenBurnsDurationMs}ms`,
  } as SpatialCSSProperties;

  return (
    <StoryContext.Provider value={value}>
      <div
        className={[styles.story, className].filter(Boolean).join(" ")}
        data-ambient-paused={ambientPaused}
        data-reduced-motion={reducedMotion}
        style={rootStyle}
        {...props}
      >
        {children}
      </div>
    </StoryContext.Provider>
  );
}

export function ParallaxImageSection({
  src,
  srcSet,
  sizes,
  alt = "",
  focalPoint = { x: 0.5, y: 0.5 },
  height = "90vh",
  motionIndex = 0,
  priority = false,
  children,
  className,
  style,
  ...props
}: ParallaxImageSectionProps) {
  const { settings, reducedMotion } = useStoryContext();
  const sectionRef = useRef<HTMLElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  useScrollScene(sectionRef, {
    depthPx: settings.imageDepthPx,
    titleDepthRatio: settings.titleDepthRatio,
    entryLineVh: settings.backgroundTitleEntryLineVh,
    exitLineVh: settings.backgroundTitleExitLineVh,
    revealSpanVh: settings.titleRevealSpanVh,
    reducedMotion,
  });

  useEffect(() => {
    const node = ambientRef.current;
    if (!node) return;

    const updateMotion = () => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // The fixed overscan is a crop-safety invariant. getBleed converts it to real pixels so
      // the nested Ken Burns layer can pan and zoom without ever exposing an image boundary.
      const overscan = 0.12;
      const { bleedX, bleedY } = getBleed(rect.width, rect.height, overscan);
      const motion = createKenBurnsMotion({
        image: { src, focalPoint },
        index: motionIndex,
        containerWidth: rect.width,
        containerHeight: rect.height,
        overscan,
        minZoom: 1 + settings.kenBurnsZoom * 0.28,
        maxZoom: 1 + settings.kenBurnsZoom,
        panStrength: settings.kenBurnsPan,
        mode: "cinematic",
      });
      node.style.setProperty("--ss-ambient-bleed-x", `${bleedX}px`);
      node.style.setProperty("--ss-ambient-bleed-y", `${bleedY}px`);
      node.style.setProperty("--ss-kb-from-x", `${motion.from.x}px`);
      node.style.setProperty("--ss-kb-from-y", `${motion.from.y}px`);
      node.style.setProperty("--ss-kb-from-scale", String(motion.from.scale));
      node.style.setProperty("--ss-kb-to-x", `${motion.to.x}px`);
      node.style.setProperty("--ss-kb-to-y", `${motion.to.y}px`);
      node.style.setProperty("--ss-kb-to-scale", String(motion.to.scale));
    };

    updateMotion();
    const observer = new ResizeObserver(updateMotion);
    observer.observe(node);
    return () => observer.disconnect();
  }, [focalPoint.x, focalPoint.y, motionIndex, settings.kenBurnsPan, settings.kenBurnsZoom, src]);

  const sectionStyle = {
    ...style,
    height,
    "--ss-focal-x": `${Math.min(1, Math.max(0, focalPoint.x)) * 100}%`,
    "--ss-focal-y": `${Math.min(1, Math.max(0, focalPoint.y)) * 100}%`,
  } as SpatialCSSProperties;

  return (
    <section
      ref={sectionRef}
      className={[styles.imageSection, className].filter(Boolean).join(" ")}
      style={sectionStyle}
      {...props}
    >
      <div className={styles.depthLayer} aria-hidden={alt ? undefined : true} data-depth-media>
        <div ref={ambientRef} className={styles.ambientFrame}>
          <div className={styles.ambientMotion}>
            <img
              className={styles.image}
              src={src}
              srcSet={srcSet}
              sizes={sizes}
              alt={alt}
              draggable={false}
              decoding="async"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
        </div>
        <div className={styles.imageShade} />
      </div>
      <div className={styles.imageContent}>{children}</div>
    </section>
  );
}

export function ParallaxBackdropSection({
  backdrop,
  height = "90vh",
  shade = true,
  children,
  className,
  style,
  ...props
}: ParallaxBackdropSectionProps) {
  const { settings, reducedMotion } = useStoryContext();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScene(sectionRef, {
    depthPx: settings.imageDepthPx,
    titleDepthRatio: settings.titleDepthRatio,
    entryLineVh: settings.backgroundTitleEntryLineVh,
    exitLineVh: settings.backgroundTitleExitLineVh,
    revealSpanVh: settings.titleRevealSpanVh,
    reducedMotion,
  });

  return (
    <section
      ref={sectionRef}
      className={[styles.imageSection, className].filter(Boolean).join(" ")}
      style={{ ...style, height }}
      {...props}
    >
      <div className={styles.depthLayer} aria-hidden="true" data-depth-media>
        <div className={styles.backdropFrame}>{backdrop}</div>
        {shade ? <div className={styles.imageShade} /> : null}
      </div>
      <div className={styles.imageContent}>{children}</div>
    </section>
  );
}

export function ForegroundSection({
  height = "100vh",
  children,
  className,
  style,
  ...props
}: ForegroundSectionProps) {
  const { settings, reducedMotion } = useStoryContext();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScene(sectionRef, {
    depthPx: 0,
    entryLineVh: settings.surfaceTitleEntryLineVh,
    // Surface titles keep the faster reveal while their viewport trigger remains independently authored.
    revealSpanVh: settings.titleRevealSpanVh * 0.6,
    reducedMotion,
  });

  return (
    <section
      ref={sectionRef}
      className={[styles.foregroundSection, className].filter(Boolean).join(" ")}
      style={{ ...style, height }}
      {...props}
    >
      <div className={styles.stickyContent}>{children}</div>
    </section>
  );
}

export function ScrollRevealTitle({
  as = "h2",
  lines,
  tone = "image",
  introOnMount = false,
  className,
  style,
  ...props
}: ScrollRevealTitleProps) {
  const { reducedMotion } = useStoryContext();

  return createElement(
    as,
    {
      className: [styles.title, className].filter(Boolean).join(" "),
      "data-tone": tone,
      "data-intro": introOnMount && !reducedMotion,
      style,
      ...props,
    },
    lines.map((line, index) => {
      return (
        <span
          className={styles.titleLine}
          data-accent={line.accent || undefined}
          key={`${line.text}-${index}`}
        >
          {line.text}
        </span>
      );
    }),
  );
}

export function ScrollRevealGroup({
  children,
  delay = 0.08,
  className,
  style,
  ...props
}: ScrollRevealGroupProps) {
  return (
    <div
      className={[styles.revealGroup, className].filter(Boolean).join(" ")}
      style={{ ...style, "--ss-group-delay": delay } as SpatialCSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
