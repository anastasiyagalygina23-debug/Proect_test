"use client";

import type { AnalyzeResult, StyleOption } from "@/types/session";

type Props = {
  analysis: AnalyzeResult & { selfieUrl: string };
  wish: string;
  onBack: () => void;
  onSelect: (style: StyleOption) => void;
};

export function StylePicker({ analysis, wish, onBack, onSelect }: Props) {
  return (
    <section className="space-y-10 animate-fade-up">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={analysis.selfieUrl} alt="Ваше селфи" className="aspect-[3/4] w-full object-cover" />
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-gold">Интерпретация</p>
          <p className="font-display text-2xl leading-snug">{analysis.interpretedWish}</p>
          <p className="text-xs uppercase tracking-widest text-gold pt-4">Master prompt</p>
          <p className="rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-muted">{analysis.masterPrompt}</p>
          <p className="text-xs text-muted">Запрос: «{wish}»</p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-3xl">Выберите стиль</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {analysis.styles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelect(style)}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-gold/40 hover:bg-white/[0.06]"
            >
              <span className="text-xs uppercase tracking-widest text-gold">{style.mood}</span>
              <h3 className="mt-2 font-display text-xl group-hover:text-gold">{style.title}</h3>
              <p className="mt-2 text-sm text-muted">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={onBack} className="text-sm text-muted underline-offset-4 hover:underline">
        ← Загрузить другое фото
      </button>
    </section>
  );
}
