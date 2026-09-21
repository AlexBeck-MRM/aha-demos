import { useEffect } from "react";
import {
  easingFromMotion,
  type BodyStyleSettings,
  type VisualLanguageSettings,
} from "../config/visualLanguage";

function formatNumber(value: number) {
  return Number(value.toFixed(3));
}

function bodyEdge(
  settings: BodyStyleSettings,
  lightRgb = "255 255 255",
  shadowRgb = "61 60 58",
  lightStrength = 1,
  shadowStrength = 1,
) {
  const lightOpacity = Math.min(1, settings.lightOpacity * lightStrength);
  const shadowOpacity = Math.min(1, settings.shadowOpacity * shadowStrength);
  const light = `inset 0 ${formatNumber(settings.lightOffsetY)}px ${formatNumber(settings.lightBlur)}px ${formatNumber(settings.lightSpread)}px rgb(${lightRgb} / ${formatNumber(lightOpacity)})`;
  const shadow = `inset 0 -${formatNumber(settings.shadowDepth)}px ${formatNumber(settings.shadowBlur)}px ${formatNumber(settings.shadowSpread)}px rgb(${shadowRgb} / ${formatNumber(shadowOpacity)})`;
  return { light, shadow, combined: `${light}, ${shadow}` };
}

function edgeMaskStops(position: number, blur: number, spread: number) {
  const solid = Math.max(1.5, position + spread);
  const fade = solid + blur * 2 + 3;
  return { solid: formatNumber(solid), fade: formatNumber(fade) };
}

export function useVisualLanguageConfig(settings: VisualLanguageSettings) {
  useEffect(() => {
    const root = document.documentElement;
    const { compact, surface, cards, reducedMotion } = settings.motion;
    const body1Edge = bodyEdge(settings.bodies.body1, "255 255 255", "10 13 18");
    const body2Edge = bodyEdge(settings.bodies.body2);
    const body3Edge = bodyEdge(settings.bodies.body3);
    const primaryBody1Edge = bodyEdge(settings.bodies.body1, "255 158 164", "125 14 23", 0.67, 2.4);
    const body2LightMask = edgeMaskStops(
      settings.bodies.body2.lightOffsetY,
      settings.bodies.body2.lightBlur,
      settings.bodies.body2.lightSpread,
    );
    const body2ShadowMask = edgeMaskStops(
      settings.bodies.body2.shadowDepth,
      settings.bodies.body2.shadowBlur,
      settings.bodies.body2.shadowSpread,
    );

    root.style.setProperty("--motion-a-scale", compact.scale.toFixed(3));
    root.style.setProperty("--motion-b-scale", surface.scale.toFixed(3));
    root.style.setProperty("--motion-a-duration", `${compact.duration}ms`);
    root.style.setProperty("--motion-b-duration", `${surface.duration}ms`);
    root.style.setProperty("--motion-a-ease", easingFromMotion(compact.spring, compact.settle));
    root.style.setProperty("--motion-b-ease", easingFromMotion(surface.spring, surface.settle));
    root.style.setProperty("--motion-card-scale", cards.scale.toFixed(3));
    root.style.setProperty("--motion-card-media-scale", cards.mediaScale.toFixed(3));
    root.style.setProperty("--motion-card-duration", `${cards.duration}ms`);
    root.style.setProperty("--motion-card-ease", easingFromMotion(cards.spring, cards.settle));
    root.style.setProperty("--motion-ease", "var(--motion-a-ease)");
    root.style.setProperty("--aha-purple", settings.colors.selected);
    root.style.setProperty("--control-height", `${settings.layout.controlHeight}px`);
    root.style.setProperty("--control-height-compact", `${settings.layout.compactControlHeight}px`);
    root.style.setProperty("--surface-1-edge", body1Edge.combined);
    root.style.setProperty("--surface-2-light-edge", body2Edge.light);
    root.style.setProperty("--surface-2-shadow-edge", body2Edge.shadow);
    root.style.setProperty("--surface-2-edge", body2Edge.combined);
    root.style.setProperty("--surface-3-edge", body3Edge.combined);
    root.style.setProperty("--primary-body-1-edge", primaryBody1Edge.combined);
    root.style.setProperty("--body-2-light-mask-solid", `${body2LightMask.solid}px`);
    root.style.setProperty("--body-2-light-mask-fade", `${body2LightMask.fade}px`);
    root.style.setProperty("--body-2-shadow-mask-solid", `${body2ShadowMask.solid}px`);
    root.style.setProperty("--body-2-shadow-mask-fade", `${body2ShadowMask.fade}px`);
    root.style.setProperty("--shader-interaction-opacity", settings.shader.interactionOpacity.toFixed(2));
    root.style.setProperty("--shader-reveal-duration", `${settings.shader.revealDuration}ms`);
    root.style.setProperty("--shader-reveal-blur", `${settings.shader.revealBlur}px`);
    root.dataset.reducedMotion = String(reducedMotion);
  }, [settings]);
}
