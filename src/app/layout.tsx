import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PasteBin",
  description: "Share code snippets instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}