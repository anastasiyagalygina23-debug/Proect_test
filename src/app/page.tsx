"use client";

import { useCallback, useState } from "react";
import type { AnalyzeResult, StyleOption } from "@/types/session";
import { HeroShowcase } from "@/components/HeroShowcase";
import { Marquee } from "@/components/Marquee";
import { MastheadTitle } from "@/components/MastheadTitle";
import { StylePicker } from "@/components/StylePicker";
import { UploadForm } from "@/components/UploadForm";

type Step = "upload" | "styles" | "generating";

export default function HomePage() {
  const [step, setStep] = useState<Step>("upload");
  const [analysis, setAnalysis] = useState<(AnalyzeResult & { selfieUrl: string }) | null>(null);
  const [wish, setWish] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onAnalyzed = useCallback((data: AnalyzeResult & { selfieUrl: string }, userWish: string) => {
    setAnalysis(data);
    setWish(userWish);
    setStep("styles");
    setError(null);
  }, []);

  const onGenerate = useCallback(
    async (style: StyleOption) => {
      if (!analysis) return;
      setStep("generating");
      setError(null);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: analysis.sessionId,
          wish,
          selfieUrl: analysis.selfieUrl,
          style,
          masterPrompt: analysis.masterPrompt,
          interpretedWish: analysis.interpretedWish,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Ошибка генерации");
        setStep("styles");
        return;
      }

      window.location.href = json.galleryUrl as string;
    },
    [analysis, wish]
  );

  const showMasthead = step === "upload";

  return (
    <>
      {step !== "generating" && <Marquee />}

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-10">
        {showMasthead && (
          <header className="relative mb-14 md:mb-20">
            <p className="label-editorial reveal">Issue №01 · 2026</p>
            <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr,0.9fr] md:items-end">
              <div>
                <MastheadTitle />
              </div>
              <p className="reveal reveal-delay-2 max-w-md text-balance text-sm leading-relaxed text-whisper md:pb-2 md:text-base">
                Селфи и одна фраза о настроении — сервис соберёт промпт, предложит стили, сохранит лицо и
                упакует серию в редакционную галерею.
              </p>
            </div>
            <span
              className="pointer-events-none absolute -right-4 top-0 hidden select-none font-display text-[8rem] font-extralight leading-none text-paper/[0.03] md:block"
              aria-hidden
            >
              AI
            </span>
          </header>
        )}

        {error && (
          <p className="reveal mb-8 border border-accent/40 bg-accent/10 px-4 py-3 text-center text-sm text-paper">
            {error}
          </p>
        )}

        {step === "upload" && (
          <div className="hero-stage">
            <HeroShowcase />
            <div className="reveal reveal-delay-3 lg:mt-12">
              <UploadForm onSuccess={onAnalyzed} onError={setError} />
            </div>
          </div>
        )}

        {step === "styles" && analysis && (
          <StylePicker
            analysis={analysis}
            wish={wish}
            onBack={() => setStep("upload")}
            onSelect={onGenerate}
          />
        )}

        {step === "generating" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 animate-fade-up">
            <div className="relative h-16 w-16">
              <span className="absolute inset-0 animate-ping rounded-sm border border-accent/30" />
              <span className="absolute inset-2 border border-accent" />
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-light md:text-3xl">Съёмка в процессе</p>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-whisper">
                Лицо · серия · галерея
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
