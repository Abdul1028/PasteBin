'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PasteEditor() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content, 
          language, 
          title,
          authorName: authorName || 'Anonymous'
        }),
      });
      
      const data = await response.json();
      router.push(`/paste/${data.id}`);
    } catch (error) {
      console.error('Failed to create paste:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 rounded border border-foreground/20 bg-background"
        />
        <input
          type="text"
          placeholder="Your name (optional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="px-3 py-2 rounded border border-foreground/20 bg-background"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 rounded border border-foreground/20 bg-background"
        >
          <option value="plaintext">Plain Text</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
        
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-foreground text-background rounded hover:opacity-90"
        >
          Create Paste
        </button>
      </div>

      <div className="h-[600px] border border-foreground/20 rounded">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          language={language}
          value={content}
          onChange={(value: string | undefined) => setContent(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
} 