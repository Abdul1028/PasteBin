import { Header } from '@/components/Header';
import { PasteList } from '@/components/PasteList';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function RecentPage() {
  const recentPastes = await prisma.paste.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Show more pastes on the recent page
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Recent Pastes</h1>
            <p className="text-foreground/60">
              Browse the latest shared content from the community.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 shadow-lg">
            {recentPastes.length > 0 ? (
              <PasteList pastes={recentPastes} />
            ) : (
              <div className="text-center py-12 text-foreground/60">
                No pastes found. Be the first to create one!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 