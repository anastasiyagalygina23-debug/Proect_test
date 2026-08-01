export function Marquee() {
  const text =
    "NEURO FOTOGRAF · EDITORIAL AI · IDENTITY LOCK · VOGUE ENERGY · PROMPT STUDIO · SERIES EXPORT · ";
  return (
    <div className="overflow-hidden border-y border-line py-2.5" aria-hidden>
      <div className="marquee-track flex w-max whitespace-nowrap">
        <span className="px-4 text-[0.65rem] uppercase tracking-[0.35em] text-whisper">{text}</span>
        <span className="px-4 text-[0.65rem] uppercase tracking-[0.35em] text-whisper">{text}</span>
      </div>
    </div>
  );
}
