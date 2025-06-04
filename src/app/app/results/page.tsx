'use client';

import { Suspense, useEffect, useState } from 'react';
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

function ResultsPageContent() {
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-float">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Loading Transcription
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch your results...</p>
        </div>
      </div>
    );
  }

  if (error || !transcription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center p-8">
        <div className="max-w-lg mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{error || 'Transcription not found'}</p>
          <Link 
            href="/app" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Transcription Results
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Your audio has been converted to text</p>
              </div>
            </div>
            <Link 
              href="/app" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to App
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Audio Player Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audio Player</h2>
            </div>
            {transcription?.audioUrl && (
              <AudioDownloadButton 
                audioUrl={transcription.audioUrl} 
                fileName={`transcription-${transcription.id}-audio`}
              />
            )}
          </div>
          
          {transcription?.audioUrl && (
            <AudioPlayer audioUrl={transcription.audioUrl} />
          )}

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {transcription ? new Date(transcription.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
              
              {transcription?.duration !== undefined && (
                <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {Math.floor(transcription.duration / 60)}:{Math.floor(transcription.duration % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              )}
              
              {transcription?.language && (
                <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {transcription.language.toUpperCase()}
                  </p>
                </div>
              )}
              
              {transcription?.confidence !== undefined && (
                <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {Math.round(transcription.confidence * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transcription</h2>
            {transcription && (
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                Confidence: {Math.round(transcription.confidence * 100)}%
              </span>
            )}
          </div>
          {transcription && (
            <TranscriptionView 
              text={transcription.text} 
              transcriptionId={transcription.id} 
            />
          )}
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

// Loading fallback component
function ResultsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Loading transcription...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsPageContent />
    </Suspense>
  );
}
