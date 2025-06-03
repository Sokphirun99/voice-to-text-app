'use client';

import { useState, useEffect, useRef } from 'react';
import useAudioRecorder from '@/app/hooks/useAudioRecorder';

interface AudioRecorderProps {
  onRecordingStart?: () => void;
  onRecordingComplete: (audioBlob: Blob) => void;
}

export default function AudioRecorder({ onRecordingStart, onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingPermission, setRecordingPermission] = useState<boolean | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    startRecording,
    stopRecording,
    recordingBlob,
    isRecordingAvailable,
    recordingError
  } = useAudioRecorder();
  
  // Effect to handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  // Effect to check recording permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setRecordingPermission(true);
      } catch (err) {
        console.error('Microphone permission denied:', err);
        setRecordingPermission(false);
      }
    };
    
    checkPermission();
  }, []);
  
  // Effect to handle the recording blob when available
  useEffect(() => {
    if (recordingBlob && !isRecording) {
      onRecordingComplete(recordingBlob);
    }
  }, [recordingBlob, isRecording, onRecordingComplete]);
  
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    startRecording();
    if (onRecordingStart) onRecordingStart();
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
  };
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (recordingPermission === false) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p className="font-medium">Microphone access is required</p>
        <p className="text-sm mt-1">Please enable microphone access in your browser settings and refresh the page.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <div className="w-full flex items-center justify-center mb-4">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}></div>
          
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={recordingPermission === null}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center focus:outline-none transition-colors duration-300 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="6" y="6" width="12" height="12" fill="currentColor" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="6" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {isRecording && (
        <div className="text-center">
          <p className="text-xl font-bold text-red-600">{formatTime(recordingDuration)}</p>
          <p className="text-sm text-gray-600 mt-1">Recording in progress...</p>
        </div>
      )}
      
      {recordingError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <p>Error: {recordingError}</p>
        </div>
      )}
      
      {!isRecording && isRecordingAvailable && !recordingBlob && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Processing recording...</span>
        </div>
      )}
    </div>
  );
}
