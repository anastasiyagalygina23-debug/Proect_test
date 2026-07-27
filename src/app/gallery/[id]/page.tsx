import { notFound } from "next/navigation";
import { getSession } from "@/lib/sessions";
import { GalleryView } from "@/components/GalleryView";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession(id);
  if (!session) notFound();

  return <GalleryView session={session} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession(id);
  return {
    title: session ? `${session.styleTitle} · Нейрофотограф` : "Галерея",
  };
}
