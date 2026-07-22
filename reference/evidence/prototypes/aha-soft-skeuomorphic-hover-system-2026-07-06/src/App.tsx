import { useMemo, useState } from "react";
import { BodyStylePanel } from "./components/lab/BodyStylePanel";
import { GlobalStateBar } from "./components/lab/GlobalStateBar";
import { LabHeader } from "./components/lab/LabHeader";
import { PreviewStateProvider } from "./components/lab/PreviewStateContext";
import { VisualLanguageBoard } from "./components/VisualLanguageBoard";
import { createVisualLanguageSettings, visualLanguageConfig, type PreviewState } from "./config/visualLanguage";
import { useBodyStyleSettings } from "./hooks/useBodyStyleSettings";
import { useSmoothPageScroll } from "./hooks/useSmoothPageScroll";
import { useVisualLanguageConfig } from "./hooks/useVisualLanguageConfig";
import { LivingGradientProvider } from "./living-gradient/LivingGradient";

export default function App() {
  const [previewState, setPreviewState] = useState<PreviewState>("rest");
  const bodyStyleController = useBodyStyleSettings();
  const visualLanguageSettings = useMemo(() => ({
    ...createVisualLanguageSettings(),
    bodies: bodyStyleController.bodies,
  }), [bodyStyleController.bodies]);
  useVisualLanguageConfig(visualLanguageSettings);
  useSmoothPageScroll(visualLanguageConfig.motion.reducedMotion);

  return (
    <LivingGradientProvider reducedMotion={visualLanguageConfig.motion.reducedMotion}>
      <PreviewStateProvider state={previewState}>
        <div className="prototype" id="top" data-preview-state={previewState}>
          <LabHeader />
          <div className="lab-workspace">
            <BodyStylePanel controller={bodyStyleController} />
            <main className="lab-main">
              <VisualLanguageBoard />
            </main>
          </div>
          <GlobalStateBar state={previewState} onChange={setPreviewState} />
        </div>
      </PreviewStateProvider>
    </LivingGradientProvider>
  );
}
