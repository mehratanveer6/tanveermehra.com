# Portfolio intro sequence — chroma-key business card (v4)

Third pass. Two prior rounds of feedback addressed:

**Round 2 fixes (engineering/realism):**
- Corner-pin perspective (`src/lib/perspective.ts`) replaces hardcoded box
  percentages — you supply 4 corner points, a proper homography computes the
  CSS `matrix3d()`.
- Fixed a real bug: the card was compositing IN FRONT of the chroma-key
  canvas. It's now correctly behind it, only visible through keyed-out
  pixels (`IntroSequence.tsx` z-order: video → card → canvas on top).
- Video freezes on its last frame for ~150ms, then the video/canvas layer is
  removed with a hard cut — no opacity fade. Because the card was already
  sitting at the identical transform the whole time, there's nothing to
  visually reconcile at that instant.
- Ambient float replaced with procedural noise (`useNoiseFloat.ts`) — sum of
  non-commensurate sine waves, doesn't repeat on any practical timescale.
- Flip now has overshoot (14° past target, eased back), translateZ lift,
  dynamic shadow, and a light sweep tied to flip progress.
- Glass: Fresnel-style edge brightening, layered translucent surfaces, an
  SVG `feTurbulence`/`feDisplacementMap` refraction filter
  (`GlassFilters.tsx`).
- Card size is measured/derived (corner geometry or ResizeObserver), never a
  hardcoded pixel constant.

**Round 3 fixes (art direction):**
- Cursor no longer drives tilt directly. `useTilt.ts` now listens at the
  window level and computes a distance-attenuated "field" value — influence
  fades out with distance from the card, heavier/slower spring, reads as air
  moving around an object rather than a joystick. The specular highlight
  still tracks the cursor closely (light behaves differently from mass).
- Every visual layer inside the card (glass, sheen, fresnel border, specular,
  shimmer, flip sweep, typography, ambient outer glow) now sits at its own
  explicit `translateZ`, inside a `preserve-3d` stack — not all coplanar.
- The card has actual modeled thickness: four edge strips (`CardEdge`)
  connect the front and back faces, visible edge-on mid-flip. It no longer
  reads as a flat plane rotating in place.

## Still true from before

Same note on the video: `public/intro.mp4` is a synthetic placeholder (dark
rectangle + flat green rectangle). Swap in real footage and update
`DEFAULT_CORNERS` in `IntroSequence.tsx` (now four x/y points, not a box) to
match where your green screen actually sits, at whatever rotation it was
shot at.

## Run locally

    npm install
    npm run dev

## Known limitations / honest gaps

- The corner-pin math assumes a flat, non-deforming quad — correct for a
  monitor screen, not for a screen that bends or has lens distortion across
  it. Fine for the stated use case.
- "Reveal thickness" is a literal 3px CSS box built from rotated edge strips,
  not a true extruded 3D mesh — reads correctly at the angles the flip
  passes through, would need WebGL/Three.js for arbitrary viewing angles
  (the brief explicitly said no Three.js for the card, so this is the CSS-only
  answer to "thickness").
- Refraction is an SVG filter with a fixed turbulence seed — subtle and
  static, not physically simulating the glass's actual optical properties.
