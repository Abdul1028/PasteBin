import { prisma } from '@/lib/prisma';
import { PasteList } from '@/components/PasteList';
import { PasteEditor } from '@/components/PasteEditor';

export default async function Home() {
  const recentPastes = await prisma.paste.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b border-foreground/10">
        <h1 className="text-2xl font-bold">NextBin</h1>
      </header>
      
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Paste</h2>
          <PasteEditor />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Pastes</h2>
          <PasteList pastes={recentPastes} />
        </div>
      </main>
    </div>
  );
}
