'use client';

import { useState } from 'react';
import Link from 'next/link';
import AudioRecorder from '@/app/components/audio/AudioRecorder';
import FileUploader from '@/app/components/ui/FileUploader';
import useTranscription from '@/app/hooks/useTranscription';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [transcriptionId, setTranscriptionId] = useState<string | null>(null);
  const { transcribe, isTranscribing, error, progress } = useTranscription();

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsRecording(false);
    setHasRecorded(true);
    
    try {
      const result = await transcribe(audioBlob);
      setTranscriptionId(result.id);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await transcribe(file);
      setTranscriptionId(result.id);
    } catch (error) {
      console.error('Error transcribing file:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Voice to Text Converter</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">Record Audio</h2>
          <div className="flex flex-col items-center">
            <AudioRecorder 
              onRecordingStart={() => setIsRecording(true)}
              onRecordingComplete={handleRecordingComplete}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Upload Audio File</h2>
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
        
        {isTranscribing && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <h3 className="text-lg font-medium mb-3">Processing Audio...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{Math.round(progress)}% Complete</p>
          </div>
        )}
        
        {error && (
          <div className="mt-8 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded">
            <p className="font-medium">Transcription Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {transcriptionId && !isTranscribing && (
          <div className="mt-8 flex justify-center">
            <Link 
              href={`/results?id=${transcriptionId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              View Transcription Results
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
