import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from './service';
import { AUDIO_CONFIG } from '@/app/lib/config';
import { createLogger } from '@/app/lib/utils/logger';

const logger = createLogger('api:transcribe');

export async function POST(request: NextRequest) {
  try {
    logger.info('Processing transcription request');
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      logger.warn('No audio file provided in request');
      return NextResponse.json(
        { error: 'No audio file provided' }, 
        { status: 400 }
      );
    }

    // Check file size
    const fileSizeLimit = AUDIO_CONFIG.MAX_UPLOAD_SIZE_MB * 1024 * 1024;
    if (audioFile.size > fileSizeLimit) {
      logger.warn(`File size exceeds limit: ${audioFile.size} bytes`);
      return NextResponse.json(
        { error: `File size exceeds limit (${AUDIO_CONFIG.MAX_UPLOAD_SIZE_MB}MB)` },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = AUDIO_CONFIG.ALLOWED_FILE_TYPES;
    if (!allowedTypes.includes(audioFile.type) && !audioFile.type.startsWith('audio/')) {
      logger.warn(`Invalid file type: ${audioFile.type}`);
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an audio file' },
        { status: 400 }
      );
    }

    // Extract options from request if provided
    const language = formData.get('language') as string | null;
    const model = formData.get('model') as string | null;
    
    // Process the transcription with options
    const transcriptionResult = await transcribeAudio(audioFile, {
      language: language || undefined,
      model: model as any || undefined,
    });

    logger.info('Transcription completed successfully', { id: transcriptionResult.id });
    return NextResponse.json(transcriptionResult);
  } catch (error) {
    logger.error('Transcription error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Error processing transcription' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unknown error processing transcription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transcriptionId = searchParams.get('id');

    if (!transcriptionId) {
      logger.warn('No transcription ID provided in request');
      return NextResponse.json(
        { error: 'No transcription ID provided' },
        { status: 400 }
      );
    }

    logger.info(`Fetching transcription with ID: ${transcriptionId}`);

    // In a real application, you would fetch the transcription from a database
    // This is a placeholder implementation
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

    return NextResponse.json(mockTranscription);
  } catch (error) {
    logger.error('Error fetching transcription:', error);
    return NextResponse.json(
      { error: 'Error retrieving transcription data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    logger.info('Processing transcription update request');
    
    const { searchParams } = new URL(request.url);
    const transcriptionId = searchParams.get('id');

    if (!transcriptionId) {
      logger.warn('No transcription ID provided in update request');
      return NextResponse.json(
        { error: 'No transcription ID provided' }, 
        { status: 400 }
      );
    }

    // Parse the JSON body
    const body = await request.json();
    
    if (!body.text) {
      logger.warn('No text provided in update request');
      return NextResponse.json(
        { error: 'No text provided for update' },
        { status: 400 }
      );
    }

    logger.info(`Updating transcription with ID: ${transcriptionId}`);

    // In a real application, you would update the transcription in a database
    // For now, we'll simulate a successful update and return the updated data
    const updatedTranscription = {
      id: transcriptionId,
      text: body.text,
      audioUrl: `/api/storage?id=${transcriptionId}`,
      confidence: 0.92, // Original confidence level
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: 65.4, // seconds
      language: 'en',
    };

    logger.info('Transcription updated successfully', { id: transcriptionId });
    return NextResponse.json(updatedTranscription);
  } catch (error) {
    logger.error('Transcription update error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Error updating transcription' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unknown error updating transcription' },
      { status: 500 }
    );
  }
}
