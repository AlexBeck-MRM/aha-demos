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
  reducedMotion: boolean;
  showLayerLabels: boolean;
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
  showLayerLabels = false,
  forceReducedMotion = false,
  children,
  className,
  style,
  ...props
}: SpatialScrollStoryProps) {
  const systemReducedMotion = usePrefersReducedMotion();
  const reducedMotion = forceReducedMotion || systemReducedMotion;
  const value = useMemo(
    () => ({ settings, reducedMotion, showLayerLabels }),
    [reducedMotion, settings, showLayerLabels],
  );
  const titleBlurGuard = settings.titleBlurInPx;
  const titleScaleGuard = Math.max(
    0,
    settings.backdropTitleScaleIn - 1,
    settings.pageTitleScaleIn - 1,
  ) * 50;
  // These guards are derived, not authored parameters: they reserve the paint envelope created
  // by blur and scale so glyphs (especially descenders) cannot be clipped at the viewport edge.
  const rootStyle = {
    ...style,
    "--ss-sheet-radius": `${settings.sheetRadiusPx}px`,
    "--ss-shade-opacity": settings.shadeOpacity,
    "--ss-title-travel": `${settings.titleTravelPx}px`,
    "--ss-backdrop-title-scale-in": settings.backdropTitleScaleIn,
    "--ss-page-title-scale-in": settings.pageTitleScaleIn,
    "--ss-title-blur-in": `${settings.titleBlurInPx}px`,
    "--ss-title-blur-guard": `${titleBlurGuard}px`,
    "--ss-title-scale-guard": `${titleScaleGuard}%`,
  } as SpatialCSSProperties;

  return (
    <StoryContext.Provider value={value}>
      <div
        className={[styles.story, className].filter(Boolean).join(" ")}
        data-reduced-motion={reducedMotion}
        style={rootStyle}
        {...props}
      >
        {children}
      </div>
    </StoryContext.Provider>
  );
}

function LayerLabel({ layer, className }: { layer: string; className?: string }) {
  return (
    <span
      className={[styles.layerLabel, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {layer}
    </span>
  );
}

export function ParallaxImageSection({
  src,
  srcSet,
  sizes,
  alt = "",
  focalPoint = { x: 0.5, y: 0.5 },
  height = "90vh",
  priority = false,
  children,
  className,
  style,
  ...props
}: ParallaxImageSectionProps) {
  const { settings, reducedMotion, showLayerLabels } = useStoryContext();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScene(sectionRef, {
    layer: "backdrop",
    backdropTravelVh: settings.backdropTravelVh,
    titleStartVh: settings.backdropTitleStartVh,
    titleFullVh: settings.backdropTitleFullVh,
    reducedMotion,
  });

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
        {showLayerLabels ? <LayerLabel layer="−2 Backdrop" /> : null}
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
        <div className={styles.imageShade} />
      </div>
      <div className={styles.imageContent}>
        {showLayerLabels ? <LayerLabel layer="−1 Backdrop Content" className={styles.contentLayerLabel} /> : null}
        {children}
      </div>
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
  const { settings, reducedMotion, showLayerLabels } = useStoryContext();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScene(sectionRef, {
    layer: "backdrop",
    backdropTravelVh: settings.backdropTravelVh,
    titleStartVh: settings.backdropTitleStartVh,
    titleFullVh: settings.backdropTitleFullVh,
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
        {showLayerLabels ? <LayerLabel layer="−2 Backdrop" /> : null}
        <div className={styles.backdropFrame}>{backdrop}</div>
        {shade ? <div className={styles.imageShade} /> : null}
      </div>
      <div className={styles.imageContent}>
        {showLayerLabels ? <LayerLabel layer="−1 Backdrop Content" className={styles.contentLayerLabel} /> : null}
        {children}
      </div>
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
  const { settings, reducedMotion, showLayerLabels } = useStoryContext();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScene(sectionRef, {
    layer: "page",
    backdropTravelVh: settings.backdropTravelVh,
    titleStartVh: settings.pageTitleStartVh,
    titleFullVh: settings.pageTitleFullVh,
    reducedMotion,
  });

  return (
    <section
      ref={sectionRef}
      className={[styles.foregroundSection, className].filter(Boolean).join(" ")}
      style={{ ...style, height }}
      {...props}
    >
      <div className={styles.stickyContent}>
        {showLayerLabels ? <LayerLabel layer="0 Page" /> : null}
        {children}
      </div>
    </section>
  );
}

export function ScrollRevealTitle({
  as = "h2",
  lines,
  tone = "image",
  introOnMount: _introOnMount,
  className,
  style,
  ...props
}: ScrollRevealTitleProps) {
  return createElement(
    as,
    {
      className: [styles.title, className].filter(Boolean).join(" "),
      "data-tone": tone,
      "data-reveal-pattern": "spatial",
      "data-scroll-reveal-title": true,
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
  delay = 0,
  className,
  style,
  ...props
}: ScrollRevealGroupProps) {
  return (
    <div
      data-scroll-reveal-group
      data-reveal-pattern="fade-move"
      className={[styles.revealGroup, className].filter(Boolean).join(" ")}
      style={{ ...style, "--ss-group-delay": Math.min(0.5, Math.max(0, delay)) } as SpatialCSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
