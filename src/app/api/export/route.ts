import { NextRequest, NextResponse } from 'next/server';
import { formatAsText, formatAsSRT, formatAsVTT, formatAsJSON, createDefaultSegmentsFromText } from './service';
import { createLogger } from '@/app/lib/utils/logger';

const logger = createLogger('api:export');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transcriptionId = searchParams.get('id');
    const format = searchParams.get('format') || 'text';
    
    if (!transcriptionId) {
      logger.warn('No transcription ID provided in request');
      return NextResponse.json(
        { error: 'No transcription ID provided' },
        { status: 400 }
      );
    }

    // In a real application, fetch the transcription from the database
    // For now, we'll simulate it with mock data (similar to the GET in transcribe/route.ts)
    logger.info(`Fetching transcription with ID: ${transcriptionId} for export in ${format} format`);

    const mockTranscription = {
      id: transcriptionId,
      text: "This is a sample transcription. In a real application, this would be fetched from a database based on the transcription ID.",
      audioUrl: "/api/storage?id=" + transcriptionId,
      confidence: 0.92,
      createdAt: new Date().toISOString(),
      duration: 65.4, // seconds
      language: 'en',
      segments: [
        {
          id: 1,
          start: 0,
          end: 3.2,
          text: "This is a sample transcription."
        },
        {
          id: 2,
          start: 3.5,
          end: 8.1,
          text: "In a real application, this would be fetched from a database"
        },
        {
          id: 3,
          start: 8.4,
          end: 10.9,
          text: "based on the transcription ID."
        }
      ]
    };

    // If segments don't exist, create them from the text
    const segments = mockTranscription.segments || 
      createDefaultSegmentsFromText(mockTranscription.text, mockTranscription.duration);

    let content = '';
    let fileExtension = '';
    let contentType = '';

    // Format according to requested format
    switch (format.toLowerCase()) {
      case 'srt':
        content = formatAsSRT(segments);
        fileExtension = 'srt';
        contentType = 'application/x-subrip';
        break;
      case 'vtt':
        content = formatAsVTT(segments);
        fileExtension = 'vtt';
        contentType = 'text/vtt';
        break;
      case 'json':
        content = formatAsJSON(segments);
        fileExtension = 'json';
        contentType = 'application/json';
        break;
      case 'text':
      default:
        content = formatAsText(mockTranscription.text);
        fileExtension = 'txt';
        contentType = 'text/plain';
    }

    // Generate a filename
    const fileName = `transcription-${transcriptionId}.${fileExtension}`;

    // Return the content with appropriate headers for download
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      }
    });

  } catch (error) {
    logger.error('Error exporting transcription:', error);
    return NextResponse.json(
      { error: 'Error exporting transcription data' },
      { status: 500 }
    );
  }
}
