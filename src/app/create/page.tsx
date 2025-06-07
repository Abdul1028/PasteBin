import { PasteEditor } from '@/components/PasteEditor';
import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';

export default async function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Create New Paste</h2>
            <p className="text-foreground/60">
              Share code snippets, logs, and more with others.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 shadow-lg">
            <PasteEditor />
          </div>
        </div>
      </main>
    </div>
  );
} 