import { prisma } from '@/lib/prisma';
import { PasteList } from '@/components/PasteList';
import { PasteEditor } from '@/components/PasteEditor';
import { Header } from '@/components/Header';

export default async function Home() {
  const recentPastes = await prisma.paste.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Create New Paste</h2>
            <p className="text-foreground/60">
              Share code snippets, logs, and more with others.
            </p>
          </div>
          <PasteEditor />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Recent Pastes</h2>
            <p className="text-foreground/60">
              Browse the latest shared content from the community.
            </p>
          </div>
          <PasteList pastes={recentPastes} />
        </div>
      </main>
    </div>
  );
}
