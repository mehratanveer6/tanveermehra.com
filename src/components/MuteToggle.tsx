"use client";

type MuteToggleProps = {
  muted: boolean;
  onToggle: () => void;
  fading: boolean;
};

export default function MuteToggle({ muted, onToggle, fading }: MuteToggleProps) {
  return (
    <button
      type="button"
      aria-label={muted ? "Unmute intro" : "Mute intro"}
      onClick={onToggle}
      className="fixed top-6 right-6 z-[60] text-white transition-opacity duration-300 hover:opacity-100"
      style={{ opacity: fading ? 0 : 0.6, transitionDuration: fading ? "700ms" : "300ms" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        ) : (
          <path
            d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
