"use client";

import { useCallback, useState } from "react";
import type { AnalyzeResult, StyleOption } from "@/types/session";
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

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-16">
      <header className="mb-16 text-center animate-fade-up">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">AI Studio</p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight md:text-7xl">
          Нейрофотограф
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-muted">
          Селфи + пара слов о настроении — сервис соберёт промпт, предложит стили и упакует серию кадров в
          галерею.
        </p>
      </header>

      {error && (
        <p className="mb-8 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-center text-sm text-red-200">
          {error}
        </p>
      )}

      {step === "upload" && <UploadForm onSuccess={onAnalyzed} onError={setError} />}

      {step === "styles" && analysis && (
        <StylePicker
          analysis={analysis}
          wish={wish}
          onBack={() => setStep("upload")}
          onSelect={onGenerate}
        />
      )}

      {step === "generating" && (
        <div className="flex flex-col items-center gap-6 py-24 animate-fade-up">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="font-display text-2xl">Съёмка в процессе…</p>
          <p className="text-sm text-muted">Сохраняем лицо · рендерим серию · собираем галерею</p>
        </div>
      )}
    </main>
  );
}
