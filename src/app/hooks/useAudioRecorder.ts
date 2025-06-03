'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioRecorderHook {
  startRecording: () => void;
  stopRecording: () => void;
  recordingBlob: Blob | null;
  isRecordingAvailable: boolean;
  recordingError: string | null;
}

export default function useAudioRecorder(): AudioRecorderHook {
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingAvailable, setIsRecordingAvailable] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  
  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      // Reset previous recording data
      setRecordingBlob(null);
      setRecordingError(null);
      mediaChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new media recorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        setIsRecording(false);
        
        const chunks = mediaChunksRef.current;
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setRecordingBlob(blob);
          setIsRecordingAvailable(true);
          
          // Stop all tracks from the stream
          stream.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('Recording error:', event);
        setRecordingError('Error during recording');
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingError('Could not access microphone');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  return {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecordingAvailable,
    recordingError
  };
}
