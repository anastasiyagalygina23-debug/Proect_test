import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { AnalyzeResult, ShotPlan, StyleOption } from "@/types/session";

const STYLE_PRESETS: StyleOption[] = [
  {
    id: "vogue-editorial",
    title: "Vogue Editorial",
    description: "Жёсткий свет, haute couture, обложка журнала",
    promptFragment:
      "high fashion Vogue editorial, dramatic studio lighting, couture styling, magazine cover quality",
    mood: "дерзко · роскошно",
  },
  {
    id: "soft-glow",
    title: "Soft Glow",
    description: "Мягкий свет, пастель, воздушная ретушь",
    promptFragment:
      "soft diffused beauty lighting, pastel palette, ethereal glow, delicate skin texture",
    mood: "нежно · мечтательно",
  },
  {
    id: "street-luxe",
    title: "Street Luxe",
    description: "Улица + премиум, движение, городской фон",
    promptFragment:
      "luxury street fashion, candid motion, urban backdrop, golden hour, cinematic depth",
    mood: "динамично · современно",
  },
  {
    id: "noir-film",
    title: "Noir Film",
    description: "Чёрно-белый кадр, контраст, кино 40-х",
    promptFragment:
      "black and white film noir portrait, high contrast, classic Hollywood, grain texture",
    mood: "драматично · вневременно",
  },
];

function defaultShots(style: StyleOption, wish: string): ShotPlan[] {
  const base = `${style.promptFragment}. Preserve exact facial identity from reference photo. ${wish}`;
  return [
    {
      id: uuidv4(),
      caption: "Обложка",
      prompt: `${base}. Close-up portrait, eyes to camera, iconic cover framing.`,
      aspectRatio: "3:4",
    },
    {
      id: uuidv4(),
      caption: "Три четверти",
      prompt: `${base}. Three-quarter body, elegant pose, negative space for typography.`,
      aspectRatio: "3:4",
    },
    {
      id: uuidv4(),
      caption: "Деталь",
      prompt: `${base}. Intimate detail shot, hands near face or fabric texture, shallow depth of field.`,
      aspectRatio: "4:5",
    },
    {
      id: uuidv4(),
      caption: "Движение",
      prompt: `${base}. Subtle motion blur in hair or fabric, editorial energy, off-center composition.`,
      aspectRatio: "3:4",
    },
  ];
}

function heuristicAnalyze(wish: string, sessionId: string): AnalyzeResult {
  const lower = wish.toLowerCase();
  const vogue = lower.includes("vogue") || lower.includes("вogue") || lower.includes("журнал");
  const styles = vogue
    ? [STYLE_PRESETS[0], STYLE_PRESETS[2], STYLE_PRESETS[1], STYLE_PRESETS[3]]
    : [...STYLE_PRESETS];

  const interpretedWish = vogue
    ? "Редакционная fashion-съёмка в духе Vogue: сильный свет, уверенная поза, журнальная подача."
    : `Персональная фотосессия по запросу: «${wish}». Акцент на узнаваемое лицо и цельный визуальный стиль.`;

  const masterPrompt = `Professional AI photoshoot. ${interpretedWish} Identity-locked face from user selfie. Photorealistic, 8k detail, tasteful retouching.`;

  return {
    sessionId,
    interpretedWish,
    masterPrompt,
    styles,
    shots: defaultShots(styles[0], wish),
  };
}

export async function analyzeWish(wish: string, sessionId: string): Promise<AnalyzeResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return heuristicAnalyze(wish, sessionId);
  }

  const openai = new OpenAI({ apiKey: key });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Ты креативный директор AI-сервиса «Нейрофотограф». По короткому запросу пользователя верни JSON:
{
  "interpretedWish": "1-2 предложения на русском",
  "masterPrompt": "English master prompt for image model, identity preservation",
  "styles": [{"id","title","description","promptFragment","mood"}] — ровно 4 варианта,
  "shots": [{"caption","prompt","aspectRatio"}] — ровно 4 кадра для первого стиля, prompts на English
}
aspectRatio только "3:4", "4:5" или "1:1".`,
        },
        { role: "user", content: wish },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return heuristicAnalyze(wish, sessionId);

    const parsed = JSON.parse(raw) as {
      interpretedWish: string;
      masterPrompt: string;
      styles: Omit<StyleOption, "id">[];
      shots: Omit<ShotPlan, "id">[];
    };

    return {
      sessionId,
      interpretedWish: parsed.interpretedWish,
      masterPrompt: parsed.masterPrompt,
      styles: parsed.styles.map((s) => ({ ...s, id: uuidv4() })),
      shots: parsed.shots.map((s) => ({ ...s, id: uuidv4() })),
    };
  } catch {
    return heuristicAnalyze(wish, sessionId);
  }
}

export function shotsForStyle(
  style: StyleOption,
  wish: string,
  masterPrompt: string
): ShotPlan[] {
  const base = `${masterPrompt} Style: ${style.promptFragment}. User wish context: ${wish}`;
  return [
    {
      id: uuidv4(),
      caption: "Обложка",
      prompt: `${base}. Cover portrait, direct gaze.`,
      aspectRatio: "3:4",
    },
    {
      id: uuidv4(),
      caption: "Портрет",
      prompt: `${base}. Classic beauty portrait, soft catchlights.`,
      aspectRatio: "3:4",
    },
    {
      id: uuidv4(),
      caption: "Полный рост",
      prompt: `${base}. Full or three-quarter fashion pose.`,
      aspectRatio: "3:4",
    },
    {
      id: uuidv4(),
      caption: "Акцент",
      prompt: `${base}. Creative crop, editorial twist.`,
      aspectRatio: "4:5",
    },
  ];
}

export { STYLE_PRESETS };
