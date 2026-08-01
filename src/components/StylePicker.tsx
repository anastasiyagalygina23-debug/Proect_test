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
    <section className="space-y-14 animate-fade-up">
      <div className="grid gap-10 lg:grid-cols-[0.85fr,1.15fr] lg:gap-16">
        <div className="relative lg:-mt-8">
          <div className="overflow-hidden border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={analysis.selfieUrl} alt="Ваше селфи" className="aspect-[3/4] w-full object-cover" />
          </div>
          <span className="absolute -bottom-3 -right-3 hidden bg-accent px-3 py-1 text-[0.6rem] uppercase tracking-widest text-void lg:block">
            Ref
          </span>
        </div>

        <div className="space-y-6 lg:pt-12">
          <p className="label-editorial">Creative brief</p>
          <p className="font-display text-2xl font-light leading-snug md:text-3xl">{analysis.interpretedWish}</p>
          <div className="border-l-2 border-accent/80 pl-5">
            <p className="label-editorial">Master prompt</p>
            <p className="mt-2 text-sm leading-relaxed text-whisper">{analysis.masterPrompt}</p>
          </div>
          <p className="text-xs text-whisper">Запрос: «{wish}»</p>
        </div>
      </div>

      <div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="font-display text-3xl font-light md:text-4xl">Выберите стиль</h2>
          <span className="label-editorial">Step 02</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {analysis.styles.map((style, i) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelect(style)}
              className="style-card-editorial"
            >
              <span className="font-display text-3xl font-extralight text-paper/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="label-editorial mt-4 block">{style.mood}</span>
              <h3 className="mt-2 font-display text-xl font-normal transition group-hover:text-accent">
                {style.title}
              </h3>
              <p className="mt-2 text-sm text-whisper">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={onBack} className="text-sm text-whisper underline-offset-4 hover:text-accent hover:underline">
        ← Другое селфи
      </button>
    </section>
  );
}
