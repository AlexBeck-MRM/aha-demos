import { createContext, useContext, type ReactNode } from "react";
import type { PreviewState } from "../../config/visualLanguage";

const PreviewStateContext = createContext<PreviewState>("rest");

export function PreviewStateProvider({ state, children }: { state: PreviewState; children: ReactNode }) {
  return <PreviewStateContext.Provider value={state}>{children}</PreviewStateContext.Provider>;
}

export function usePreviewState() {
  return useContext(PreviewStateContext);
}
