'use client';

import { useAudioContext } from '@/app/context/AudioContext';
import { useState, useEffect } from 'react';

export default function RecordingStatus() {
  const { isRecording, isProcessing, transcriptionProgress, transcriptionError } = useAudioContext();
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Handle recording timer
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    
    if (isRecording) {
      setRecordingTime(0);
      timerId = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!isRecording && !isProcessing && !transcriptionError) return null;
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center z-50">
      {isRecording && (
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
          <span className="font-medium text-red-500">Recording</span>
          <span className="ml-2 font-mono">{formatTime(recordingTime)}</span>
        </div>
      )}
      
      {isProcessing && !isRecording && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-500 mr-2" />
          <span className="font-medium text-blue-500">Processing Audio...</span>
          {transcriptionProgress > 0 && (
            <span className="ml-2 text-sm text-blue-500">{Math.round(transcriptionProgress)}%</span>
          )}
        </div>
      )}
      
      {transcriptionError && !isRecording && !isProcessing && (
        <div className="flex items-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Error: {transcriptionError}</span>
        </div>
      )}
    </div>
  );
}
