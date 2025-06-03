import { v4 as uuidv4 } from 'uuid';
import { processAudioForTranscription } from '@/app/lib/utils/audioHelpers';
import { saveAudioFile } from '@/app/lib/utils/storage';
import { transcribeWithWhisper } from '@/app/lib/services/whisper';
import { transcribeAudioWithService } from '@/app/lib/services/speechService';
import { TRANSCRIPTION_CONFIG } from '@/app/lib/config';
import { createLogger } from '@/app/lib/utils/logger';

const logger = createLogger('transcribe-service');

interface TranscriptionOptions {
  language?: string;
  model?: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  service?: 'whisper' | 'google' | 'azure';
  diarize?: boolean;
  timestamps?: boolean;
  format?: 'text' | 'json' | 'srt' | 'vtt';
  punctuate?: boolean;
}

export interface TranscriptionResult {
  id: string;
  text: string;
  audioUrl: string;
  confidence: number;
  createdAt: string;
  language?: string;
  duration?: number;
  segments?: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
  }>;
}

/**
 * Main function to handle audio transcription
 */
export async function transcribeAudio(
  audioFile: File, 
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  logger.info('Starting audio transcription process', { filename: audioFile.name, fileSize: audioFile.size });
  
  // Generate a unique ID for this transcription
  const transcriptionId = uuidv4();
  
  // Process the audio file (format conversion, normalization, etc.)
  logger.debug('Processing audio file');
  const processedAudio = await processAudioForTranscription(audioFile);
  
  // Save the processed audio file
  logger.debug('Saving processed audio file');
  const audioUrl = await saveAudioFile(processedAudio, transcriptionId);
  
  // Set up transcription options
  const service = options.service || TRANSCRIPTION_CONFIG.DEFAULT_SERVICE || 'whisper';
  const language = options.language || TRANSCRIPTION_CONFIG.DEFAULT_LANGUAGE;
  const model = options.model || TRANSCRIPTION_CONFIG.DEFAULT_MODEL;
  
  logger.info('Performing transcription', { service, language, model });
  
  // Perform the actual transcription with the selected service
  const transcriptionResult = await transcribeAudioWithService(processedAudio, service as 'whisper' | 'google' | 'azure');
  
  // Create and return the result object
  const result: TranscriptionResult = {
    id: transcriptionId,
    text: transcriptionResult.text,
    audioUrl,
    confidence: transcriptionResult.confidence || 0.85, // Default confidence if not provided
    createdAt: new Date().toISOString(),
    language: transcriptionResult.language || language,
    duration: transcriptionResult.processingTime
  };
  
  // Add segments if available
  if (transcriptionResult.segments && transcriptionResult.segments.length > 0) {
    result.segments = transcriptionResult.segments;
  }
  
  // In a real application, you would store this result in a database
  logger.info('Transcription completed', { id: transcriptionId });
  
  return result;
}
