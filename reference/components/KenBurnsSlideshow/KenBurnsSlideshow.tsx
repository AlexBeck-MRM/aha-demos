import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type AnimationEvent,
  type CSSProperties,
} from "react";

import styles from "./KenBurnsSlideshow.module.css";
import {
  DEFAULTS,
  createKenBurnsMotion,
  getBleed,
  type KenBurnsImage,
  type KenBurnsMode,
  type KenBurnsMotion,
} from "./motion";
import { preloadUpcomingImages } from "./preloadImages";
import { useContainerSize } from "./useContainerSize";
import { useInViewport } from "./useInViewport";
import { usePageVisibility } from "./usePageVisibility";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type { KenBurnsImage } from "./motion";

export type KenBurnsSlideshowProps = {
  images: KenBurnsImage[];
  durationMs?: number;
  fadeMs?: number;
  overscan?: number;
  minZoom?: number;
  maxZoom?: number;
  panStrength?: number;
  mode?: KenBurnsMode;
  seed?: number;
  className?: string;
  pauseWhenHidden?: boolean;
  pauseWhenOffscreen?: boolean;
  respectReducedMotion?: boolean;
  showPauseControl?: boolean;
  pauseControlLabel?: string;
  playControlLabel?: string;
  decorative?: boolean;
};

type SlideRole = "active" | "incoming" | "outgoing" | "idle";

type SlideSlot = {
  slotId: "a" | "b";
  imageIndex: number;
  role: SlideRole;
  motion: KenBurnsMotion;
  animationKey: number;
};

type KenBurnsCSSProperties = CSSProperties & Record<`--kb-${string}`, string | number>;

export function KenBurnsSlideshow({
  images,
  durationMs = DEFAULTS.durationMs,
  fadeMs = DEFAULTS.fadeMs,
  overscan = DEFAULTS.overscan,
  minZoom = DEFAULTS.minZoom,
  maxZoom = DEFAULTS.maxZoom,
  panStrength = DEFAULTS.panStrength,
  mode = DEFAULTS.mode,
  seed,
  className,
  pauseWhenHidden = DEFAULTS.pauseWhenHidden,
  pauseWhenOffscreen = DEFAULTS.pauseWhenOffscreen,
  respectReducedMotion = DEFAULTS.respectReducedMotion,
  showPauseControl = DEFAULTS.showPauseControl,
  pauseControlLabel = DEFAULTS.pauseControlLabel,
  playControlLabel = DEFAULTS.playControlLabel,
  decorative = DEFAULTS.decorative,
}: KenBurnsSlideshowProps) {
  const { ref: rootRef, node: rootNode, size } = useContainerSize<HTMLDivElement>();
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [erroredSources, setErroredSources] = useState<Set<string>>(() => new Set());
  const [slots, setSlots] = useState<SlideSlot[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion(respectReducedMotion);
  const isTabHidden = usePageVisibility(pauseWhenHidden);
  const isOffscreen = useInViewport(rootNode, pauseWhenOffscreen);
  const usableImages = useMemo(() => {
    const inputImages = Array.isArray(images) ? images : [];

    return inputImages.filter((image) => image?.src && !erroredSources.has(image.src));
  }, [images, erroredSources]);
  const imageSignature = useMemo(
    () => usableImages.map((image) => image.src).join("|"),
    [usableImages],
  );
  const config = useMemo(() => {
    const safeDurationMs = clampNumber(finiteNumber(durationMs, DEFAULTS.durationMs), 1000, 120000);
    const safeFadeMs = clampNumber(finiteNumber(fadeMs, DEFAULTS.fadeMs), 0, 5000);
    const safeMinZoom = Math.max(1, finiteNumber(minZoom, DEFAULTS.minZoom));
    const safeMaxZoom = Math.max(safeMinZoom, finiteNumber(maxZoom, DEFAULTS.maxZoom));

    return {
      durationMs: safeDurationMs,
      fadeMs: Math.min(safeFadeMs, safeDurationMs),
      overscan: clampNumber(finiteNumber(overscan, DEFAULTS.overscan), 0, 0.4),
      minZoom: safeMinZoom,
      maxZoom: safeMaxZoom,
      panStrength: clampNumber(finiteNumber(panStrength, DEFAULTS.panStrength), 0, 1),
      mode,
    };
  }, [durationMs, fadeMs, maxZoom, minZoom, mode, overscan, panStrength]);
  const configKey = `${config.durationMs}|${config.fadeMs}|${config.overscan}|${config.minZoom}|${config.maxZoom}|${config.panStrength}|${config.mode}|${seed ?? ""}`;
  const isReducedMotion = respectReducedMotion && prefersReducedMotion;
  const isAnimated = usableImages.length > 1 && !isReducedMotion;
  const isEffectivelyPaused =
    isUserPaused || isTabHidden || isOffscreen || isReducedMotion;
  const activeSlot = slots.find((slot) => slot.role === "active") ?? slots[0];
  const activeIndex = activeSlot?.imageIndex ?? 0;
  const { bleedX, bleedY } = getBleed(size.width, size.height, config.overscan);
  const rootClassName = [styles.root, className].filter(Boolean).join(" ");
  const rootStyle = {
    "--kb-bleed-x": `${bleedX}px`,
    "--kb-bleed-y": `${bleedY}px`,
    "--kb-move-duration": `${config.durationMs + config.fadeMs * 2}ms`,
    "--kb-fade-duration": `${config.fadeMs}ms`,
  } as KenBurnsCSSProperties;

  const getMotion = useCallback(
    (imageIndex: number, animationKey: number) => {
      const image = usableImages[imageIndex] ?? usableImages[0] ?? { src: "" };

      return createKenBurnsMotion({
        image,
        index: imageIndex + animationKey,
        containerWidth: size.width,
        containerHeight: size.height,
        overscan: config.overscan,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        panStrength: config.panStrength,
        mode: config.mode,
        seed,
      });
    },
    [
      config.maxZoom,
      config.minZoom,
      config.mode,
      config.overscan,
      config.panStrength,
      seed,
      size.height,
      size.width,
      usableImages,
    ],
  );

  useEffect(() => {
    preloadUpcomingImages(usableImages, activeIndex);
  }, [activeIndex, imageSignature, usableImages]);

  useEffect(() => {
    setIsTransitioning(false);

    if (!isAnimated) {
      setSlots([]);
      return;
    }

    setSlots([
      createSlot("a", 0, "active", 0, getMotion),
      createSlot("b", getNextIndex(0, usableImages.length), "idle", 0, getMotion),
    ]);
  }, [configKey, imageSignature, isAnimated, usableImages.length]);

  useEffect(() => {
    if (!isAnimated) {
      return;
    }

    setSlots((currentSlots) =>
      currentSlots.map((slot) => {
        if (slot.role === "idle") {
          return slot;
        }

        return {
          ...slot,
          motion: getMotion(slot.imageIndex, slot.animationKey),
        };
      }),
    );
  }, [configKey, getMotion, isAnimated, size.height, size.width]);

  const completeTransition = useCallback(() => {
    setSlots((currentSlots) =>
      currentSlots.map((slot) => {
        if (slot.role === "incoming") {
          return { ...slot, role: "active" };
        }

        if (slot.role === "outgoing") {
          return { ...slot, role: "idle" };
        }

        return slot;
      }),
    );
    setIsTransitioning(false);
  }, []);

  const startTransition = useCallback(() => {
    const canStartTransition =
      usableImages.length >= 2 &&
      slots.some((slot) => slot.role === "active") &&
      slots.some((slot) => slot.role === "idle");

    if (!canStartTransition) {
      return;
    }

    setIsTransitioning(true);
    setSlots((currentSlots) => {
      const active = currentSlots.find((slot) => slot.role === "active");
      const idle = currentSlots.find((slot) => slot.role === "idle");

      if (!active || !idle || usableImages.length < 2) {
        return currentSlots;
      }

      const nextImageIndex = getNextIndex(active.imageIndex, usableImages.length);

      return currentSlots.map((slot) => {
        if (slot.slotId === active.slotId) {
          return { ...slot, role: "outgoing" };
        }

        if (slot.slotId === idle.slotId) {
          const nextAnimationKey = slot.animationKey + 1;

          return {
            ...slot,
            imageIndex: nextImageIndex,
            role: "incoming",
            animationKey: nextAnimationKey,
            motion: getMotion(nextImageIndex, nextAnimationKey),
          };
        }

        return slot;
      });
    });
  }, [getMotion, slots, usableImages.length]);

  useEffect(() => {
    if (!isAnimated || isEffectivelyPaused || isTransitioning) {
      return;
    }

    const timer = window.setTimeout(startTransition, config.durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    config.durationMs,
    isAnimated,
    isEffectivelyPaused,
    isTransitioning,
    startTransition,
  ]);

  useEffect(() => {
    if (!isTransitioning || config.fadeMs > 0 || isEffectivelyPaused) {
      return;
    }

    const timer = window.setTimeout(completeTransition, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [completeTransition, config.fadeMs, isEffectivelyPaused, isTransitioning]);

  const handleFadeAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      completeTransition();
    },
    [completeTransition],
  );

  const handleImageError = useCallback((src: string) => {
    setErroredSources((currentSources) => {
      if (currentSources.has(src)) {
        return currentSources;
      }

      const nextSources = new Set(currentSources);
      nextSources.add(src);
      return nextSources;
    });
  }, []);

  const togglePaused = useCallback(() => {
    setIsUserPaused((currentValue) => !currentValue);
  }, []);

  if (usableImages.length === 0) {
    return null;
  }

  if (!isAnimated || slots.length === 0) {
    const image = usableImages[Math.min(activeIndex, usableImages.length - 1)] ?? usableImages[0];

    return (
      <div
        ref={rootRef}
        className={rootClassName}
        data-paused={isEffectivelyPaused}
        data-reduced-motion={isReducedMotion}
        data-respect-reduced-motion={respectReducedMotion}
        style={rootStyle}
      >
        <img
          className={styles.staticImage}
          src={image.src}
          alt={decorative ? "" : image.alt ?? ""}
          aria-hidden={decorative ? true : undefined}
          draggable={false}
          onError={() => handleImageError(image.src)}
        />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      data-paused={isEffectivelyPaused}
      data-reduced-motion={isReducedMotion}
      data-respect-reduced-motion={respectReducedMotion}
      style={rootStyle}
    >
      {slots.map((slot) => {
        const image = usableImages[slot.imageIndex];

        if (!image) {
          return null;
        }

        return (
          <div
            key={`${slot.slotId}-${slot.animationKey}`}
            className={styles.slide}
            data-state={slot.role}
            onAnimationEnd={
              slot.role === "incoming" ? handleFadeAnimationEnd : undefined
            }
          >
            {/*
              Overscan is the safety margin. The slide layer is larger than the
              visible clipped root, and motion is clamped inside that extra area
              so the background never peeks through during pan, zoom, or fade.
            */}
            <div className={styles.motion} style={getMotionStyle(slot.motion)}>
              <img
                className={styles.image}
                src={image.src}
                alt={decorative ? "" : image.alt ?? ""}
                aria-hidden={decorative ? true : undefined}
                draggable={false}
                onError={() => handleImageError(image.src)}
              />
            </div>
          </div>
        );
      })}

      {showPauseControl ? (
        <button
          type="button"
          className={styles.pauseButton}
          aria-pressed={isUserPaused}
          aria-label={isUserPaused ? playControlLabel : pauseControlLabel}
          title={isUserPaused ? playControlLabel : pauseControlLabel}
          onClick={togglePaused}
        >
          <span className={styles.icon} aria-hidden="true">
            {isUserPaused ? <PlayIcon /> : <PauseIcon />}
          </span>
        </button>
      ) : null}
    </div>
  );
}

function createSlot(
  slotId: "a" | "b",
  imageIndex: number,
  role: SlideRole,
  animationKey: number,
  getMotion: (imageIndex: number, animationKey: number) => KenBurnsMotion,
): SlideSlot {
  return {
    slotId,
    imageIndex,
    role,
    animationKey,
    motion: getMotion(imageIndex, animationKey),
  };
}

function getMotionStyle(motion: KenBurnsMotion) {
  return {
    "--kb-from-x": `${motion.from.x}px`,
    "--kb-from-y": `${motion.from.y}px`,
    "--kb-from-scale": motion.from.scale,
    "--kb-to-x": `${motion.to.x}px`,
    "--kb-to-y": `${motion.to.y}px`,
    "--kb-to-scale": motion.to.scale,
  } as KenBurnsCSSProperties;
}

function getNextIndex(currentIndex: number, imageCount: number) {
  if (imageCount <= 0) {
    return 0;
  }

  return (currentIndex + 1) % imageCount;
}

function finiteNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 20 20" focusable="false">
      <path d="M6 4h3v12H6V4Zm5 0h3v12h-3V4Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" focusable="false">
      <path d="M6 4.5v11l9-5.5-9-5.5Z" />
    </svg>
  );
}
