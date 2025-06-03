import { NextRequest, NextResponse } from 'next/server';
import { getAudioFile, deleteAudioFile } from '@/app/lib/utils/storage';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'No file ID provided' },
        { status: 400 }
      );
    }

    // Get the file from storage
    const file = await getAudioFile(fileId);
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // In a production environment, you'd stream the file from cloud storage
    // This is a simplified version for demonstration purposes
    return new NextResponse(file.data, {
      headers: {
        'Content-Type': file.contentType,
        'Content-Disposition': `inline; filename="${fileId}.${file.extension}"`,
      },
    });

  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json(
      { error: 'Error retrieving file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'No file ID provided' },
        { status: 400 }
      );
    }

    const success = await deleteAudioFile(fileId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'File not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Error deleting file' },
      { status: 500 }
    );
  }
}
