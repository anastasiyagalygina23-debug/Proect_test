"use client";

import Link from "next/link";
import { useState } from "react";
import type { GallerySession } from "@/types/session";

export function GalleryView({ session }: { session: GallerySession }) {
  const [active, setActive] = useState(0);
  const shot = session.shots[active];

  return (
    <div className="min-h-screen pb-20">
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="text-xs uppercase tracking-[0.3em] text-gold">
          Нейрофотограф
        </Link>
        {session.demo && (
          <span className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold">
            Демо-режим
          </span>
        )}
      </nav>

      <header className="px-6 md:px-12 animate-fade-up">
        <p className="text-xs uppercase tracking-widest text-muted">
          {new Date(session.createdAt).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-6xl">{session.styleTitle}</h1>
        <p className="mt-4 max-w-2xl text-muted">{session.interpretedWish}</p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr,1fr] lg:px-12">
        <div className="px-6 lg:px-0">
          {shot && (
            <figure className="overflow-hidden rounded-sm bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.url}
                alt={shot.caption}
                className="mx-auto max-h-[75vh] w-full object-contain"
              />
              <figcaption className="border-t border-white/10 px-6 py-4 font-display text-xl">
                {shot.caption}
              </figcaption>
            </figure>
          )}
        </div>

        <aside className="px-6 lg:px-0">
          <p className="text-xs uppercase tracking-widest text-gold">Серия</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {session.shots.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-lg border transition ${
                  i === active ? "border-gold ring-1 ring-gold" : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.url} alt={s.caption} className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-white/10 p-5">
            <p className="text-xs uppercase text-muted">Исходное селфи</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session.selfieUrl}
              alt="Селфи"
              className="mt-3 w-24 rounded-lg object-cover"
            />
          </div>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full border border-gold/50 px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-gold/10"
          >
            Новая съёмка
          </Link>
        </aside>
      </div>
    </div>
  );
}
