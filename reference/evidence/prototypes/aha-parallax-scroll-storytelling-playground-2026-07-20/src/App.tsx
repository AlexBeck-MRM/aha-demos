import { useState } from "react";

import { LivingGradientProvider } from "../../aha-soft-skeuomorphic-hover-system-2026-07-06/src/living-gradient/LivingGradient";
import { DemoHeader } from "./components/DemoHeader";
import { ParameterPanel } from "./components/ParameterPanel";
import { StoryDemo } from "./components/StoryDemo";
import { useParallaxSettings } from "./hooks/useParallaxSettings";
import { useSmoothPageScroll } from "./hooks/useSmoothPageScroll";

export default function App() {
  const controller = useParallaxSettings();
  const [ambientPaused, setAmbientPaused] = useState(false);
  // Preview behavior is session-only; it must not silently become part of authored design output.
  const [reducedMotionPreview, setReducedMotionPreview] = useState(false);
  useSmoothPageScroll(reducedMotionPreview);

  return (
    <LivingGradientProvider reducedMotion={ambientPaused || reducedMotionPreview}>
      <div className="prototype" id="top">
        <DemoHeader />
        <div className="workspace">
          <main className="story-canvas" aria-label="Parallax scroll storytelling preview">
            <StoryDemo
              settings={controller.settings}
              ambientPaused={ambientPaused}
              reducedMotionPreview={reducedMotionPreview}
            />
          </main>
          <ParameterPanel
            controller={controller}
            ambientPaused={ambientPaused}
            onAmbientPausedChange={setAmbientPaused}
            reducedMotionPreview={reducedMotionPreview}
            onReducedMotionPreviewChange={setReducedMotionPreview}
          />
        </div>
      </div>
    </LivingGradientProvider>
  );
}
