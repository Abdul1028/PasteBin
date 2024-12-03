import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';

// Simple admin check - in production, use proper authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function checkAdminAuth(formData: FormData): Promise<void> {
  'use server';
  
  const password = formData.get('password');
  if (password === ADMIN_PASSWORD) {
    redirect('/admin/dashboard');
  }
  throw new Error('Invalid password');
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-foreground/60">Enter admin password to continue.</p>
          </div>

          <form action={checkAdminAuth} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground/70">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 