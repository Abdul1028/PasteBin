'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type * as Monaco from 'monaco-editor';
import { useToast } from "@/hooks/use-toast";

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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string, name: string }>>([]);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "Error",
        description: "File size should be less than 50MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      setUploadedFiles(prev => [...prev, { url: result.url, name: file.name }]);
      
      toast({
        description: "File uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = { 
        content, 
        language, 
        title,
        authorName: authorName || 'Anonymous'
      };
      
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create paste');
      }
      
      router.refresh();
      router.push(`/paste/${result.id}`);
    } catch (error) {
      console.error('Failed to create paste:', error);
      toast({
        title: "Error",
        description: "Failed to create paste",
        variant: "destructive"
      });
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

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/70">
            Attach Files (Optional)
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background"
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/70">Uploaded Files:</p>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
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