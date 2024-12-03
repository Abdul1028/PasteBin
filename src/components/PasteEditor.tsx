'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type * as Monaco from 'monaco-editor';

const LANGUAGE_OPTIONS = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' }
].sort((a, b) => a.label.localeCompare(b.label));

interface MonacoEditorProps {
  value: string | undefined;
  language: string;
  // Add other props as needed
}

export function PasteEditor() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const data = { 
        content, 
        language, 
        title,
        authorName: authorName || 'Anonymous'
      };
      
      console.log('Submitting paste:', data);

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log('Response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create paste');
      }
      
      router.refresh();
      router.push(`/paste/${result.id}`);
    } catch (error) {
      console.error('Failed to create paste:', error);
    }
  };

  const handleEditorWillMount = (monaco: typeof Monaco) => {
    if (!monaco.languages.getLanguages().some((lang: { id: string }) => lang.id === 'java')) {
      monaco.languages.register({ id: 'java' });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setContent(value || '');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-foreground/70">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="My awesome code"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="author" className="block text-sm font-medium text-foreground/70">
            Your Name
          </label>
          <input
            id="author"
            type="text"
            placeholder="Anonymous"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="language" className="block text-sm font-medium text-foreground/70">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:self-end">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            Create Paste
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-foreground/20 overflow-hidden">
        <Editor
          height="600px"
          defaultLanguage="plaintext"
          language={language}
          value={content}
          onChange={handleEditorChange}
          theme="vs-dark"
          beforeMount={handleEditorWillMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            autoIndent: 'advanced',
          }}
        />
      </div>
    </div>
  );
} 