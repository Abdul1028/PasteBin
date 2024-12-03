import Link from 'next/link';
import type { Paste } from '@prisma/client';

interface PasteListProps {
  pastes: Paste[];
}

export function PasteList({ pastes }: PasteListProps) {
  return (
    <div className="space-y-3">
      {pastes.map((paste) => (
        <Link
          key={paste.id}
          href={`/paste/${paste.id}`}
          className="block p-4 rounded-lg border border-foreground/10 hover:border-foreground/20 transition-all hover:shadow-lg bg-background"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-medium truncate">
                {paste.title || `Untitled ${paste.language} paste`}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-foreground/60">
                <span>{paste.authorName}</span>
                <span>•</span>
                <span>{new Date(paste.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-foreground/5 text-foreground/70">
                {paste.language}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 