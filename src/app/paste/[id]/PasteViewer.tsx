'use client';

import { Editor } from '@monaco-editor/react';
import type { Paste } from '@prisma/client';
import { Header } from '@/components/Header';

interface PasteViewerProps {
  paste: Paste;
}

export function PasteViewer({ paste }: PasteViewerProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {paste.title ? paste.title : `Untitled ${paste.language} paste`}
            </h1>
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{paste.authorName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>{new Date(paste.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                  <path d="M9 9h1" />
                </svg>
                <span>{paste.language}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-foreground/20 overflow-hidden">
            <Editor
              height="70vh"
              language={paste.language}
              value={paste.content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
              theme="vs-dark"
            />
          </div>
        </div>
      </main>
    </div>
  );
} 