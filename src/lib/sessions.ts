import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { GallerySession } from "@/types/session";

const DATA_DIR = path.join(process.cwd(), "data", "sessions");

export async function saveSession(session: GallerySession): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    path.join(DATA_DIR, `${session.id}.json`),
    JSON.stringify(session, null, 2),
    "utf-8"
  );
}

export async function getSession(id: string): Promise<GallerySession | null> {
  try {
    const raw = await readFile(path.join(DATA_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw) as GallerySession;
  } catch {
    return null;
  }
}
