import Link from 'next/link';
import type { Paste } from '@prisma/client';

interface PasteListProps {
  pastes: Paste[];
}

export function PasteList({ pastes }: PasteListProps) {
  return (
    <div className="space-y-4">
      {pastes.map((paste) => (
        <Link
          key={paste.id}
          href={`/paste/${paste.id}`}
          className="block p-4 border border-foreground/10 rounded hover:border-foreground/20 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">
              {paste.title || `Untitled ${paste.language} paste`}
            </span>
            <span className="text-sm text-foreground/60">
              {new Date(paste.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm text-foreground/60">
            <span>by {paste.authorName}</span>
            <span>{paste.language}</span>
          </div>
        </Link>
      ))}
    </div>
  );
} 