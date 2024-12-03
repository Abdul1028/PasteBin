'use client';

import { Editor } from '@monaco-editor/react';
import type { Paste } from '@prisma/client';
import Link from 'next/link';

interface PasteViewerProps {
  paste: Paste;
}

export function PasteViewer({ paste }: PasteViewerProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b border-foreground/10">
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:opacity-80">
            NextBin
          </Link>
        </h1>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {paste.title || `Untitled ${paste.language} paste`}
          </h2>
          <div className="text-sm text-foreground/60 mt-1">
            <span>by {paste.authorName} • </span>
            <span>{new Date(paste.createdAt).toLocaleString()} • </span>
            <span>{paste.language}</span>
          </div>
        </div>
        
        <div className="h-[600px] border border-foreground/20 rounded">
          <Editor
            height="100%"
            language={paste.language}
            value={paste.content}
            options={{
              readOnly: true,
              minimap: { enabled: false },
            }}
            theme="vs-dark"
          />
        </div>
      </main>
    </div>
  );
} 