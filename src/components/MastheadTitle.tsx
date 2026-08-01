"use client";

import TextType from "@/components/TextType";

const HEADLINE_LINES = [
  "фотограф",
  "как Vogue",
  "с вашим лицом",
  "editorial AI",
  "серия кадров",
];

export function MastheadTitle() {
  return (
    <h1 className="reveal reveal-delay-1 font-display text-[clamp(2.75rem,11vw,5.5rem)] font-extralight leading-[0.95] tracking-tight">
      Нейро
      <TextType
        as="span"
        text={HEADLINE_LINES}
        className="masthead-type block font-normal text-accent"
        typingSpeed={75}
        deletingSpeed={50}
        pauseDuration={1500}
        initialDelay={400}
        showCursor
        cursorCharacter="_"
        cursorBlinkDuration={0.5}
        cursorClassName="text-champagne"
        loop
        startOnVisible
      />
    </h1>
  );
}
