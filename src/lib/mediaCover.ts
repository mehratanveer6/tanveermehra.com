export type Rect = { x: number; y: number; width: number; height: number };

/**
 * Where a video sized (mediaWidth x mediaHeight) actually lands inside a
 * container sized (containerWidth x containerHeight) when rendered with
 * `object-fit: cover` — i.e. filled and center-cropped, never letterboxed.
 * Everything that needs to place something "at a specific point in the
 * video" (the chroma box, the card behind it) goes through this first.
 */
export function getObjectCoverRect(
  containerWidth: number,
  containerHeight: number,
  mediaWidth: number,
  mediaHeight: number
): Rect {
  const containerRatio = containerWidth / containerHeight;
  const mediaRatio = mediaWidth / mediaHeight;

  let width: number;
  let height: number;

  if (mediaRatio > containerRatio) {
    height = containerHeight;
    width = height * mediaRatio;
  } else {
    width = containerWidth;
    height = width / mediaRatio;
  }

  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height,
  };
}

/** A normalized (0-1) point in media space to container pixel space, given a cover rect. */
export function mediaPointToContainerPixels(
  normX: number,
  normY: number,
  coverRect: Rect
): { x: number; y: number } {
  return {
    x: coverRect.x + normX * coverRect.width,
    y: coverRect.y + normY * coverRect.height,
  };
}
