import Image from "next/image";

export function HeroShowcase() {
  return (
    <figure className="hero-showcase reveal reveal-delay-2 relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
      <span className="hero-showcase-tag label-editorial">Cover story</span>
      <div className="hero-showcase-frame relative overflow-hidden border border-line shadow-[12px_12px_0_rgba(255,61,90,0.18)]">
        <Image
          src="/hero-showcase.png"
          alt="Пример ночной editorial-съёмки в стиле Нейрофотограф"
          width={960}
          height={1280}
          priority
          className="aspect-[3/4] max-h-[min(72vh,640px)] w-full object-cover object-[center_15%]"
        />
        <div className="hero-showcase-fade pointer-events-none absolute inset-0" aria-hidden />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div>
            <span className="label-editorial">Showcase</span>
            <p className="mt-1 max-w-[11rem] text-[0.72rem] leading-snug text-whisper">
              Night editorial · sequins · city lights · identity preserved
            </p>
          </div>
          <span className="label-editorial text-paper">№01</span>
        </figcaption>
      </div>
      <span className="hero-showcase-stamp">AI sample</span>
      <span className="hero-showcase-line hidden lg:block" aria-hidden />
    </figure>
  );
}
