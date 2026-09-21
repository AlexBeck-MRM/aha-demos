import { useState, type CSSProperties } from "react";

import { LivingGradientProvider } from "../../aha-soft-skeuomorphic-hover-system-2026-07-06/src/living-gradient/LivingGradient";
import type { SpatialMotionSettings } from "../../../../components/SpatialScrollStory";
import { DemoHeader } from "./components/DemoHeader";
import { ParameterPanel } from "./components/ParameterPanel";
import { StoryDemo } from "./components/StoryDemo";
import { useParallaxSettings } from "./hooks/useParallaxSettings";
import { useSmoothPageScroll } from "./hooks/useSmoothPageScroll";

type TriggerHintStyle = CSSProperties & Record<`--trigger-hint-${string}`, string>;

function ScrollTriggerHints({ settings }: { settings: SpatialMotionSettings }) {
  const hints = [
    {
      id: "backdrop-start",
      label: "Backdrop title start",
      value: settings.backdropTitleStartVh,
      color: "rgb(255 0 0)",
      textColor: "rgb(255 255 255)",
    },
    {
      id: "backdrop-full",
      label: "Backdrop title full-in",
      value: settings.backdropTitleFullVh,
      color: "rgb(255 0 255)",
      textColor: "rgb(0 0 0)",
    },
    {
      id: "page-start",
      label: "Page title start",
      value: settings.pageTitleStartVh,
      color: "rgb(0 0 255)",
      textColor: "rgb(255 255 255)",
    },
    {
      id: "page-full",
      label: "Page title full-in",
      value: settings.pageTitleFullVh,
      color: "rgb(0 255 255)",
      textColor: "rgb(0 0 0)",
    },
  ];

  return (
    <div className="scroll-trigger-hints" aria-hidden="true">
      {hints.map((hint) => (
        <div
          className={`scroll-trigger-hint scroll-trigger-hint-${hint.id}`}
          style={{
            "--trigger-hint-position": `${hint.value}vh`,
            "--trigger-hint-color": hint.color,
            "--trigger-hint-text": hint.textColor,
          } as TriggerHintStyle}
          key={hint.id}
        >
          <span>{hint.label} <strong>{hint.value}vh</strong></span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const controller = useParallaxSettings();
  const [shaderPaused, setShaderPaused] = useState(false);
  // Preview behavior is session-only; it must not silently become part of authored design output.
  const [reducedMotionPreview, setReducedMotionPreview] = useState(false);
  const [triggerHintsVisible, setTriggerHintsVisible] = useState(false);
  const [layerLabelsVisible, setLayerLabelsVisible] = useState(true);
  useSmoothPageScroll(reducedMotionPreview);

  return (
    <LivingGradientProvider reducedMotion={shaderPaused || reducedMotionPreview}>
      <div className="prototype" id="top">
        <DemoHeader />
        <div className="workspace">
          <main className="story-canvas" aria-label="Parallax scroll storytelling preview">
            <StoryDemo
              settings={controller.settings}
              reducedMotionPreview={reducedMotionPreview}
              showLayerLabels={layerLabelsVisible}
            />
            {triggerHintsVisible ? <ScrollTriggerHints settings={controller.settings} /> : null}
          </main>
          <ParameterPanel
            controller={controller}
            shaderPaused={shaderPaused}
            onShaderPausedChange={setShaderPaused}
            reducedMotionPreview={reducedMotionPreview}
            onReducedMotionPreviewChange={setReducedMotionPreview}
            triggerHintsVisible={triggerHintsVisible}
            onTriggerHintsVisibleChange={setTriggerHintsVisible}
            layerLabelsVisible={layerLabelsVisible}
            onLayerLabelsVisibleChange={setLayerLabelsVisible}
          />
        </div>
      </div>
    </LivingGradientProvider>
  );
}
