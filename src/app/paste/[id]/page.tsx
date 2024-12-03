import { prisma } from '@/lib/prisma';
import { PasteViewer } from './PasteViewer';
import { notFound } from 'next/navigation';

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await prisma.paste.findUnique({
    where: { id: params.id },
  });

  if (!paste) {
    notFound();
  }

  const serializedPaste = {
    ...paste,
    createdAt: paste.createdAt.toISOString(),
  };

  return <PasteViewer paste={serializedPaste} />;
} 