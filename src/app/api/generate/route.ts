import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { shotsForStyle } from "@/lib/prompt-engine";
import { generateSeries, isDemoMode } from "@/lib/image-gen";
import { saveSession } from "@/lib/sessions";
import type { StyleOption } from "@/types/session";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    sessionId?: string;
    wish?: string;
    selfieUrl?: string;
    style?: StyleOption;
    masterPrompt?: string;
    interpretedWish?: string;
    shots?: { id: string; caption: string; prompt: string; aspectRatio: "3:4" | "4:5" | "1:1" }[];
  };

  const {
    sessionId = uuidv4(),
    wish = "",
    selfieUrl = "",
    style,
    masterPrompt = "",
    interpretedWish = "",
    shots: presetShots,
  } = body;

  if (!selfieUrl || !style) {
    return NextResponse.json({ error: "Не хватает данных для генерации" }, { status: 400 });
  }

  const shots =
    presetShots && presetShots.length > 0
      ? presetShots
      : shotsForStyle(style, wish, masterPrompt);

  const demo = isDemoMode();
  const generated = await generateSeries({
    sessionId,
    shots,
    selfiePath: selfieUrl,
    demo,
  });

  const session = {
    id: sessionId,
    createdAt: new Date().toISOString(),
    wish,
    styleTitle: style.title,
    selfieUrl,
    interpretedWish,
    masterPrompt,
    shots: generated,
    demo,
  };

  await saveSession(session);

  return NextResponse.json({ sessionId, galleryUrl: `/gallery/${sessionId}`, session });
}
