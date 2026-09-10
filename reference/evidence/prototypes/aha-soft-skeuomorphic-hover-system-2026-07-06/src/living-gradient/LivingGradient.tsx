import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LivingGradientRuntime } from "./runtime";
import type { LivingGradientEffect } from "./types";

const LivingGradientContext = createContext<LivingGradientRuntime | null>(null);

export function LivingGradientProvider({
  children,
  reducedMotion
}: {
  children: ReactNode;
  reducedMotion: boolean;
}) {
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
  const [runtime, setRuntime] = useState<LivingGradientRuntime | null>(null);

  useEffect(() => {
    if (!sourceCanvas) return;
    const nextRuntime = new LivingGradientRuntime(sourceCanvas);
    nextRuntime.start();
    setRuntime(nextRuntime);
    return () => {
      nextRuntime.destroy();
      setRuntime((current) => (current === nextRuntime ? null : current));
    };
  }, [sourceCanvas]);

  useEffect(() => {
    runtime?.setManualReducedMotion(reducedMotion);
  }, [reducedMotion, runtime]);

  return (
    <LivingGradientContext.Provider value={runtime}>
      <canvas
        ref={setSourceCanvas}
        className="living-gradient-source"
        data-living-gradient-source
        aria-hidden="true"
      />
      {children}
    </LivingGradientContext.Provider>
  );
}

export function LivingGradientLayer({ effect }: { effect: LivingGradientEffect }) {
  const runtime = useContext(LivingGradientContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!runtime || !canvas) return;
    return runtime.register(canvas, effect);
  }, [effect.behavior, runtime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!runtime || !canvas) return;
    runtime.update(canvas, effect);
  }, [effect.behavior, effect.enabled, effect.tone, runtime]);

  return (
    <canvas
      ref={canvasRef}
      className="living-gradient-canvas"
      data-gradient-active="false"
      data-gradient-ready="false"
      aria-hidden="true"
    />
  );
}

export type { LivingGradientEffect } from "./types";
