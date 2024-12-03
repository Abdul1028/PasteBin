import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paste = await prisma.paste.create({
      data: {
        content: body.content,
        language: body.language,
        title: body.title || null,
        authorName: body.authorName,
      },
    });
    
    return NextResponse.json(paste);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create paste' },
      { status: 500 }
    );
  }
} 