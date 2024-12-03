import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await prisma.paste.delete({
      where: {
        id: context.params.id,
      },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete paste:', error);
    return NextResponse.json(
      { error: 'Failed to delete paste' },
      { status: 500 }
    );
  }
} 