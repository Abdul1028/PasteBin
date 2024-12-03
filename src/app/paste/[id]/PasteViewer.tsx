'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Copy, Check, Download, Clock, User, Code2, Link, MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PasteViewerProps {
  paste: {
    content: string;
    language: string;
    title?: string;
    authorName: string;
    createdAt: Date | string;
  };
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function PasteViewer({ paste }: PasteViewerProps) {
  const [copied, setCopied] = useState(false);
  const { content, language, title, authorName, createdAt } = paste;
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      // Try using the Clipboard API
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        description: "Content copied to clipboard!",
        duration: 2000,
      });
    } catch (err) {
      // Fallback method using textarea
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          description: "Content copied to clipboard!",
          duration: 2000,
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Please try selecting and copying manually.",
        });
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'Shared Paste',
          text: `Check out this paste: ${title || 'Untitled'}`,
          url: window.location.href,
        });
        toast({
          description: "Share dialog opened!",
        });
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        toast({
          description: "Link copied to clipboard!",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to share",
        description: "Please try copying the URL manually.",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'paste'}.${language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        description: "Link copied to clipboard!",
        duration: 2000,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy link",
        description: "Please try copying the URL manually.",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const text = `${title || 'Untitled Paste'}\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{title || 'Untitled Paste'}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span className="capitalize">{language}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 self-end md:self-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {typeof navigator !== 'undefined' && navigator.share && (
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share via...
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleWhatsAppShare}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Share on WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link className="mr-2 h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border bg-background/50">
            <Editor
              height="600px"
              language={language.toLowerCase()}
              value={content}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: 'all',
                renderWhitespace: 'selection',
                smoothScrolling: true,
                contextmenu: false,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 