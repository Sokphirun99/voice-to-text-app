'use client';

import { useState } from 'react';

interface TranscriptionHook {
  transcribe: (audio: Blob | File) => Promise<TranscriptionResult>;
  isTranscribing: boolean;
  error: string | null;
  progress: number;
}

export interface TranscriptionResult {
  id: string;
  text: string;
  confidence: number;
  duration: number;
  audioUrl: string;
}

export default function useTranscription(): TranscriptionHook {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const transcribe = async (audio: Blob | File): Promise<TranscriptionResult> => {
    setIsTranscribing(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('audio', audio);
      
      // Simulate progress during upload/processing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe audio');
      }
      
      setProgress(100);
      const result = await response.json();
      
      return {
        id: result.id,
        text: result.text,
        confidence: result.confidence,
        duration: result.duration || 0,
        audioUrl: result.audioUrl
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during transcription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  };
  
  return {
    transcribe,
    isTranscribing,
    error,
    progress
  };
}
