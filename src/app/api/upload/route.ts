import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file: File | null = formData.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Blob
    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });

    // Upload to Vercel Blob
    const response = await put(file.name, blob, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
      multipart: true
    });
    
    return NextResponse.json({
      url: response.url,
      success: true
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 