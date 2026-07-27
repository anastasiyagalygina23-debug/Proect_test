import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { GeneratedShot, ShotPlan } from "@/types/session";

function svgPlaceholder(caption: string, index: number): string {
  const stops = [
    ["#1a1a1d", "#c9a962"],
    ["#0f0f12", "#f5f0e8"],
    ["#2c1810", "#6b6560"],
    ["#0a0a0b", "#c9a962"],
  ][index % 4]!;
  const safeCaption = caption.replace(/[<>&'"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${stops[0]}"/>
      <stop offset="100%" stop-color="${stops[1]}"/>
    </linearGradient></defs>
    <rect width="480" height="640" fill="url(#g)"/>
    <text x="40" y="560" fill="#f5f0e8" font-family="Georgia,serif" font-size="28">${safeCaption}</text>
    <text x="40" y="595" fill="#c9a962" font-family="system-ui,sans-serif" font-size="14">NEURO · demo ${index + 1}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function saveDataUrl(dataUrl: string, filename: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1]! : dataUrl;
  const buf = Buffer.from(base64, "base64");
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buf);
  return `/uploads/${filename}`;
}

async function replicateGenerate(
  selfieUrl: string,
  shot: ShotPlan
): Promise<string | null> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;

  const selfieAbsolute =
    selfieUrl.startsWith("http") || selfieUrl.startsWith("data:")
      ? selfieUrl
      : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${selfieUrl}`;

  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait=120",
    },
    body: JSON.stringify({
      version: "black-forest-labs/flux-dev",
      input: {
        prompt: `${shot.prompt}. photorealistic portrait, same person as reference.`,
        image: selfieAbsolute,
        num_outputs: 1,
        aspect_ratio: shot.aspectRatio === "1:1" ? "1:1" : "3:4",
        output_format: "webp",
      },
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { output?: string | string[] };
  const out = Array.isArray(data.output) ? data.output[0] : data.output;
  return out ?? null;
}

export async function generateSeries(options: {
  sessionId: string;
  shots: ShotPlan[];
  selfiePath: string;
  demo: boolean;
}): Promise<GeneratedShot[]> {
  const { sessionId, shots, selfiePath, demo } = options;
  const results: GeneratedShot[] = [];

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i]!;
    let url: string;

    if (!demo) {
      const remote = await replicateGenerate(selfiePath, shot);
      if (remote) {
        results.push({ id: shot.id, caption: shot.caption, url: remote, prompt: shot.prompt });
        continue;
      }
    }

    const dataUrl = svgPlaceholder(shot.caption, i);
    url = await saveDataUrl(dataUrl, `${sessionId}-${shot.id}.svg`);
    results.push({ id: shot.id, caption: shot.caption, url, prompt: shot.prompt });
  }

  return results;
}

export function isDemoMode(): boolean {
  if (process.env.NEURO_DEMO_MODE === "false") return false;
  if (process.env.REPLICATE_API_TOKEN) return false;
  return true;
}
