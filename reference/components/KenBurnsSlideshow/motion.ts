export type KenBurnsImage = {
  src: string;
  alt?: string;
  focalPoint?: {
    x: number;
    y: number;
  };
};

export type KenBurnsMotion = {
  from: {
    x: number;
    y: number;
    scale: number;
  };
  to: {
    x: number;
    y: number;
    scale: number;
  };
};

export type KenBurnsMode = "gentle" | "cinematic" | "focal" | "random";

export const DEFAULTS = {
  durationMs: 22000,
  fadeMs: 750,
  overscan: 0.12,
  minZoom: 1,
  maxZoom: 1.08,
  panStrength: 0.65,
  mode: "cinematic" as KenBurnsMode,
  pauseWhenHidden: true,
  pauseWhenOffscreen: true,
  respectReducedMotion: true,
  showPauseControl: true,
  pauseControlLabel: "Pause background animation",
  playControlLabel: "Play background animation",
  decorative: true,
};

export const MOTION_ROUTES = [
  "left-to-right",
  "right-to-left",
  "top-to-bottom",
  "bottom-to-top",
  "top-left-to-bottom-right",
  "bottom-right-to-top-left",
  "centre-zoom-in",
  "centre-zoom-out",
] as const;

type MotionRoute = (typeof MOTION_ROUTES)[number];

type CreateMotionOptions = {
  image: KenBurnsImage;
  index: number;
  containerWidth: number;
  containerHeight: number;
  overscan: number;
  minZoom: number;
  maxZoom: number;
  panStrength: number;
  mode: KenBurnsMode;
  seed?: number;
};

export function getBleed(
  containerWidth: number,
  containerHeight: number,
  overscan: number,
) {
  const safeOverscan = clampNumber(overscan, 0, 0.4);

  return {
    bleedX: roundPx(Math.max(0, containerWidth) * safeOverscan),
    bleedY: roundPx(Math.max(0, containerHeight) * safeOverscan),
  };
}

export function createKenBurnsMotion({
  image,
  index,
  containerWidth,
  containerHeight,
  overscan,
  minZoom,
  maxZoom,
  panStrength,
  mode,
  seed,
}: CreateMotionOptions): KenBurnsMotion {
  const safeMinZoom = Math.max(1, finiteNumber(minZoom, DEFAULTS.minZoom));
  const requestedMaxZoom = Math.max(
    safeMinZoom,
    finiteNumber(maxZoom, DEFAULTS.maxZoom),
  );
  const intensity = mode === "gentle" ? 0.55 : 1;
  const effectivePanStrength =
    clampNumber(finiteNumber(panStrength, DEFAULTS.panStrength), 0, 1) *
    intensity;
  const effectiveMaxZoom =
    safeMinZoom + (requestedMaxZoom - safeMinZoom) * intensity;
  const { bleedX, bleedY } = getBleed(containerWidth, containerHeight, overscan);
  const safeX = bleedX * effectivePanStrength;
  const safeY = bleedY * effectivePanStrength;
  const route = chooseRoute({
    image,
    index,
    width: containerWidth,
    height: containerHeight,
    mode,
    seed,
  });
  const motion = mapRouteToMotion(route, safeX, safeY, safeMinZoom, effectiveMaxZoom);

  return clampMotion(
    applyFocalBias(motion, image, safeX, safeY, mode),
    safeX,
    safeY,
    safeMinZoom,
    effectiveMaxZoom,
  );
}

function chooseRoute({
  image,
  index,
  width,
  height,
  mode,
  seed,
}: {
  image: KenBurnsImage;
  index: number;
  width: number;
  height: number;
  mode: KenBurnsMode;
  seed?: number;
}): MotionRoute {
  const candidates = getRouteCandidates(width, height);

  if (mode === "random") {
    const stableSeed = seed ?? hashString(`${image.src}:${index}`);
    const routeIndex = Math.floor(seededRandom(stableSeed + index * 97) * candidates.length);
    return candidates[routeIndex] ?? "centre-zoom-in";
  }

  if (mode === "focal" && image.focalPoint) {
    const focalX = clampNumber(image.focalPoint.x, 0, 1);
    const focalY = clampNumber(image.focalPoint.y, 0, 1);

    if (focalX < 0.35 || focalX > 0.65) {
      return index % 2 === 0 ? "top-to-bottom" : "bottom-to-top";
    }

    if (focalY < 0.35 || focalY > 0.65) {
      return index % 2 === 0 ? "left-to-right" : "right-to-left";
    }
  }

  return candidates[index % candidates.length] ?? "centre-zoom-in";
}

function getRouteCandidates(width: number, height: number): MotionRoute[] {
  const smallestSide = Math.min(width, height);
  const largestSide = Math.max(width, height);
  const aspectSpread = smallestSide > 0 ? largestSide / smallestSide : 1;

  if (smallestSide < 420 || aspectSpread > 2.4) {
    return MOTION_ROUTES.filter(
      (route) =>
        route !== "top-left-to-bottom-right" &&
        route !== "bottom-right-to-top-left",
    );
  }

  return [...MOTION_ROUTES];
}

function mapRouteToMotion(
  route: MotionRoute,
  safeX: number,
  safeY: number,
  minZoom: number,
  maxZoom: number,
): KenBurnsMotion {
  const midZoom = minZoom + (maxZoom - minZoom) * 0.45;
  const diagonalX = safeX * 0.72;
  const diagonalY = safeY * 0.72;

  switch (route) {
    case "left-to-right":
      return buildMotion(-safeX, 0, midZoom, safeX, 0, maxZoom);
    case "right-to-left":
      return buildMotion(safeX, 0, midZoom, -safeX, 0, maxZoom);
    case "top-to-bottom":
      return buildMotion(0, -safeY, midZoom, 0, safeY, maxZoom);
    case "bottom-to-top":
      return buildMotion(0, safeY, midZoom, 0, -safeY, maxZoom);
    case "top-left-to-bottom-right":
      return buildMotion(-diagonalX, -diagonalY, midZoom, diagonalX, diagonalY, maxZoom);
    case "bottom-right-to-top-left":
      return buildMotion(diagonalX, diagonalY, midZoom, -diagonalX, -diagonalY, maxZoom);
    case "centre-zoom-out":
      return buildMotion(0, 0, maxZoom, 0, 0, minZoom);
    case "centre-zoom-in":
    default:
      return buildMotion(0, 0, minZoom, 0, 0, maxZoom);
  }
}

function applyFocalBias(
  motion: KenBurnsMotion,
  image: KenBurnsImage,
  safeX: number,
  safeY: number,
  mode: KenBurnsMode,
): KenBurnsMotion {
  if (!image.focalPoint) {
    return motion;
  }

  const focalX = clampNumber(image.focalPoint.x, 0, 1);
  const focalY = clampNumber(image.focalPoint.y, 0, 1);
  const biasStrength = mode === "focal" ? 0.65 : 0.25;
  const biasX = (0.5 - focalX) * safeX * biasStrength;
  const biasY = (0.5 - focalY) * safeY * biasStrength;

  return {
    from: {
      ...motion.from,
      x: motion.from.x + biasX,
      y: motion.from.y + biasY,
    },
    to: {
      ...motion.to,
      x: motion.to.x + biasX,
      y: motion.to.y + biasY,
    },
  };
}

function clampMotion(
  motion: KenBurnsMotion,
  safeX: number,
  safeY: number,
  minZoom: number,
  maxZoom: number,
): KenBurnsMotion {
  return {
    from: {
      x: roundPx(clampNumber(motion.from.x, -safeX, safeX)),
      y: roundPx(clampNumber(motion.from.y, -safeY, safeY)),
      scale: roundScale(clampNumber(motion.from.scale, minZoom, maxZoom)),
    },
    to: {
      x: roundPx(clampNumber(motion.to.x, -safeX, safeX)),
      y: roundPx(clampNumber(motion.to.y, -safeY, safeY)),
      scale: roundScale(clampNumber(motion.to.scale, minZoom, maxZoom)),
    },
  };
}

function buildMotion(
  fromX: number,
  fromY: number,
  fromScale: number,
  toX: number,
  toY: number,
  toScale: number,
): KenBurnsMotion {
  return {
    from: {
      x: fromX,
      y: fromY,
      scale: fromScale,
    },
    to: {
      x: toX,
      y: toY,
      scale: toScale,
    },
  };
}

function seededRandom(seed: number) {
  let value = seed + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function finiteNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundPx(value: number) {
  return Number(value.toFixed(3));
}

function roundScale(value: number) {
  return Number(value.toFixed(4));
}
