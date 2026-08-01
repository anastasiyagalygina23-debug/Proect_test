import type { Metadata } from "next";
import { Geologica, Unbounded } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["200", "400", "500"],
  variable: "--font-display",
});

const sans = Geologica({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Нейрофотограф — AI fashion-съёмка по селфи",
  description: "Загрузите селфи, опишите образ — получите серию кадров и галерею",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans">
        <div className="site-ambient" aria-hidden />
        <div className="site-grain" aria-hidden />
        <div className="site-frame">{children}</div>
      </body>
    </html>
  );
}
