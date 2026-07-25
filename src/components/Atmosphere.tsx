/**
 * Background presence for the hero, nothing more. A soft glow, a flicker of
 * grain, a vignette pulling the eye inward. It sits behind the card at all
 * times — including underneath the intro image, so there's no layer to pop
 * in when the intro dissolves away — and it never animates fast enough or
 * brightly enough to compete with the card for attention.
 */
export default function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      {/* slow volumetric glow, drifting */}
      <div
        className="absolute -inset-[20%]"
        style={{
          background: "radial-gradient(45% 45% at 50% 42%, var(--card-accent) 0%, transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.16,
          animation: "atmosphere-drift 24s ease-in-out infinite, atmosphere-pulse 10s ease-in-out infinite",
        }}
      />

      {/* film grain -- flickers in place, doesn't scroll or drift */}
      <div
        className="absolute -inset-[10%] mix-blend-overlay"
        style={{
          opacity: 0.035,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          animation: "grain-flicker 1s steps(8) infinite",
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
