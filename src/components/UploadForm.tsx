"use client";

import { useRef, useState } from "react";
import type { AnalyzeResult } from "@/types/session";

type Props = {
  onSuccess: (data: AnalyzeResult & { selfieUrl: string }, wish: string) => void;
  onError: (msg: string) => void;
};

export function UploadForm({ onSuccess, onError }: Props) {
  const [wish, setWish] = useState("хочу фото как Vogue");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      onError("Выберите селфи");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("wish", wish);
    form.append("selfie", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        onError(json.error || "Не удалось разобрать запрос");
        return;
      }
      onSuccess(json, wish);
    } catch {
      onError("Сеть недоступна");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-lg space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur animate-fade-up"
    >
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-gold">Селфи</span>
        <div
          className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-ink/50 py-12 transition hover:border-gold/50"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Превью" className="max-h-48 rounded-lg object-cover" />
          ) : (
            <p className="text-sm text-muted">Нажмите, чтобы загрузить JPG или PNG</p>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-gold">Ваш запрос</span>
        <textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-ink/80 px-4 py-3 text-cream outline-none ring-gold/30 focus:ring-2"
          placeholder="хочу фото как Vogue"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gold py-3.5 text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-[#d4b872] disabled:opacity-50"
      >
        {loading ? "Составляем промпт…" : "Продолжить"}
      </button>
    </form>
  );
}
