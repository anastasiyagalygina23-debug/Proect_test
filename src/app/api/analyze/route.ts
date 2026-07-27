import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { analyzeWish } from "@/lib/prompt-engine";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const wish = String(form.get("wish") || "").trim();
  const file = form.get("selfie");

  if (!wish || wish.length < 3) {
    return NextResponse.json({ error: "Опишите желаемый образ (минимум 3 символа)" }, { status: 400 });
  }

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Загрузите селфи (JPEG или PNG)" }, { status: 400 });
  }

  const sessionId = uuidv4();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const selfieFilename = `${sessionId}-selfie.${safeExt}`;
  await writeFile(path.join(uploadDir, selfieFilename), buffer);

  const analysis = await analyzeWish(wish, sessionId);

  return NextResponse.json({
    ...analysis,
    selfieUrl: `/uploads/${selfieFilename}`,
  });
}
