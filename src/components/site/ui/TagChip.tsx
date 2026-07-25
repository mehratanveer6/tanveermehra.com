type TagChipProps = {
  children: string;
  muted?: boolean;
};

export function TagChip({ children, muted = false }: TagChipProps) {
  return (
    <span
      className={[
        "rounded-sm border px-2.5 py-1 font-label text-[10px] uppercase tracking-[0.08em]",
        "transition-colors duration-300",
        muted
          ? "border-hairline text-mist"
          : "border-hairline text-mist group-hover:border-paper/30 group-hover:text-paper/80",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
