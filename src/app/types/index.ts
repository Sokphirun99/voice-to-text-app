/**
 * Core types for the Voice-to-Text application
 */

export interface Transcription {
  id: string;
  text: string;
  audioUrl: string;
  confidence: number;
  createdAt: string;
  duration?: number;
  language?: string;
  segments?: TranscriptionSegment[];
  metadata?: Record<string, any>;
}

export interface TranscriptionSegment {
  id: number;
  start: number;  // Start time in seconds
  end: number;    // End time in seconds
  text: string;
  confidence?: number;
  speaker?: string;
}

export interface AudioFile {
  id: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  duration?: number;
  createdAt: string;
}

export interface TranscriptionOptions {
  language?: string;
  model?: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  service?: 'whisper' | 'google' | 'azure';
  diarize?: boolean;  // Speaker identification
  punctuate?: boolean;
  format?: 'text' | 'json' | 'srt' | 'vtt';
  timestamps?: boolean;
}

export interface TranscriptionRequest {
  audioFile: File | Blob;
  options?: TranscriptionOptions;
}

export interface TranscriptionResponse {
  transcription: Transcription;
  error?: string;
}
