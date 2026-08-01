"use client";

import Link from "next/link";
import { useState } from "react";
import { Marquee } from "@/components/Marquee";
import type { GallerySession } from "@/types/session";

export function GalleryView({ session }: { session: GallerySession }) {
  const [active, setActive] = useState(0);
  const shot = session.shots[active];

  return (
    <div className="min-h-screen pb-20">
      <Marquee />

      <nav className="flex items-center justify-between px-5 py-6 md:px-12">
        <Link href="/" className="label-editorial hover:text-accent">
          Нейрофотограф
        </Link>
        {session.demo && (
          <span className="border border-champagne/40 px-3 py-1 text-[0.62rem] uppercase tracking-widest text-champagne">
            Demo
          </span>
        )}
      </nav>

      <header className="relative px-5 md:px-12 animate-fade-up">
        <p className="label-editorial">
          {new Date(session.createdAt).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,8vw,4.5rem)] font-light leading-none">
          {session.styleTitle}
        </h1>
        <p className="mt-6 max-w-xl text-whisper">{session.interpretedWish}</p>
        <span
          className="pointer-events-none absolute right-6 top-0 hidden select-none font-display text-[6rem] font-extralight text-paper/[0.04] md:block"
          aria-hidden
        >
          {String(active + 1).padStart(2, "0")}
        </span>
      </header>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr,0.75fr] lg:gap-12 lg:px-12">
        <div className="px-5 lg:px-0">
          {shot && (
            <figure className="relative border border-line bg-void">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.url}
                alt={shot.caption}
                className="mx-auto max-h-[78vh] w-full object-contain"
              />
              <figcaption className="flex items-baseline justify-between border-t border-line px-6 py-4">
                <span className="font-display text-xl">{shot.caption}</span>
                <span className="text-[0.65rem] uppercase tracking-widest text-whisper">Frame</span>
              </figcaption>
            </figure>
          )}
        </div>

        <aside className="px-5 lg:px-0 lg:pt-8">
          <p className="label-editorial">Contact sheet</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {session.shots.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                className={`overflow-hidden border transition ${
                  i === active
                    ? "border-accent opacity-100 ring-1 ring-accent"
                    : "border-line opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.url} alt={s.caption} className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-10 border border-line p-5">
            <p className="label-editorial">Reference</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session.selfieUrl} alt="Селфи" className="mt-4 w-20 border border-line object-cover" />
          </div>

          <Link href="/" className="btn-ghost mt-8">
            Новая съёмка
          </Link>
        </aside>
      </div>
    </div>
  );
}
