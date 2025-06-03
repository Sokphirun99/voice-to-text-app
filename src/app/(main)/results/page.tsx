'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TranscriptionView from '@/app/components/ui/TranscriptionView';
import AudioPlayer from '@/app/components/audio/AudioPlayer';
import AudioDownloadButton from '@/app/components/ui/AudioDownloadButton';
import Link from 'next/link';

interface Transcription {
  id: string;
  text: string;
  audioUrl: string;
  confidence: number;
  createdAt: string;
  duration?: number;
  language?: string;
  segments?: {
    id: number;
    start: number;
    end: number;
    text: string;
  }[];
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const transcriptionId = searchParams.get('id');
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transcriptionId) {
      setError('No transcription ID provided');
      setIsLoading(false);
      return;
    }

    const fetchTranscription = async () => {
      try {
        const response = await fetch(`/api/transcribe?id=${transcriptionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transcription');
        }
        const data = await response.json();
        setTranscription(data);
      } catch (err) {
        setError('Error fetching transcription data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscription();
  }, [transcriptionId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Loading transcription...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !transcription) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="mb-6">{error || 'Transcription not found'}</p>
          <Link 
            href="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Transcription Results</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Audio</h2>
            {transcription.audioUrl && (
              <AudioDownloadButton 
                audioUrl={transcription.audioUrl} 
                fileName={`transcription-${transcription.id}-audio`}
              />
            )}
          </div>
          {transcription.audioUrl && (
            <AudioPlayer audioUrl={transcription.audioUrl} />
          )}

          {/* Metadata section */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 mr-2">Created:</span>
                <span>{new Date(transcription.createdAt).toLocaleString()}</span>
              </div>
              
              {transcription.duration !== undefined && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">Duration:</span>
                  <span>{Math.floor(transcription.duration / 60)}:{Math.floor(transcription.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
              
              {transcription.language && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">Language:</span>
                  <span>{transcription.language.toUpperCase()}</span>
                </div>
              )}
              
              {transcription.segments && (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">Segments:</span>
                  <span>{transcription.segments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transcription</h2>
            <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
              Confidence: {Math.round(transcription.confidence * 100)}%
            </span>
          </div>
          <TranscriptionView 
            text={transcription.text} 
            transcriptionId={transcription.id} 
          />
        </div>
        
        <div className="flex justify-between">
          <Link 
            href="/" 
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded"
          >
            Return to Home
          </Link>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
            onClick={() => window.print()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
