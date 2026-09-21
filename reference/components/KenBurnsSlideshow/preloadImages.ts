import type { KenBurnsImage } from "./motion";

export function preloadUpcomingImages(
  images: KenBurnsImage[],
  currentIndex: number,
) {
  if (typeof Image === "undefined" || images.length === 0) {
    return;
  }

  const seen = new Set<string>();

  [0, 1, 2].forEach((offset) => {
    const image = images[(currentIndex + offset) % images.length];

    if (!image?.src || seen.has(image.src)) {
      return;
    }

    seen.add(image.src);
    const preload = new Image();
    preload.decoding = "async";
    preload.src = image.src;
  });
}
