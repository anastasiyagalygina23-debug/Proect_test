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
    <form onSubmit={submit} className="panel-editorial space-y-8">
      <div className="flex items-baseline justify-between border-b border-line pb-4">
        <span className="label-editorial">Casting call</span>
        <span className="text-[0.65rem] text-whisper">Step 01</span>
      </div>

      <label className="block">
        <span className="label-editorial">Селфи</span>
        <div
          className="group mt-4 flex min-h-[11rem] cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-void transition hover:border-accent/60"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Превью" className="max-h-52 w-full object-cover" />
          ) : (
            <p className="px-4 text-center text-sm text-whisper transition group-hover:text-paper">
              Перетащите или нажмите · JPG / PNG
            </p>
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
        <span className="label-editorial">Ваш запрос</span>
        <textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          rows={3}
          className="mt-4 w-full resize-none border border-line bg-transparent px-4 py-3 text-paper outline-none transition focus:border-accent"
          placeholder="хочу фото как Vogue"
        />
      </label>

      <button type="submit" disabled={loading} className="btn-accent disabled:opacity-40">
        {loading ? "Составляем промпт…" : "К creative direction →"}
      </button>
    </form>
  );
}
