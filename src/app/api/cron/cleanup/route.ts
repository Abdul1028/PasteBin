import { NextResponse } from 'next/server';

// Vercel Blob automatically handles expiration, so we don't need to do anything
export async function GET() {
  return NextResponse.json({ 
    message: "Cleanup not needed - Vercel Blob handles expiration automatically"
  });
} 