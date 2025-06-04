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
      // Import the VS Code browser check function
      let isInVSCodeBrowserFn;
      try {
        // Dynamic import to avoid circular dependencies
        const module = await import('@/app/lib/utils/browserCompat');
        isInVSCodeBrowserFn = module.isInVSCodeBrowser;
      } catch (e) {
        // Default function if import fails
        isInVSCodeBrowserFn = () => false;
      }
      
      // Don't even try recording in VS Code Simple Browser
      if (isInVSCodeBrowserFn()) {
        throw new Error('Audio recording is not supported in VS Code Simple Browser');
      }

      // Reset previous recording data
      setRecordingBlob(null);
      setRecordingError(null);
      mediaChunksRef.current = [];

      // Check for secure context with broader compatibility
      const isLocalhost = window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '0.0.0.0';
      const isHttps = window.location.protocol === 'https:';
      const isSecureContext = window.isSecureContext || isHttps || isLocalhost;

      if (!isSecureContext) {
        throw new Error('Audio recording requires HTTPS or localhost');
      }

      // Check if mediaDevices is available
      if (!navigator.mediaDevices) {
        throw new Error('MediaDevices API not supported in this browser');
      }

      // Ensure getUserMedia is available (with legacy fallback)
      if (!navigator.mediaDevices.getUserMedia) {
        const legacyNav = navigator as any;
        const legacyGetUserMedia = legacyNav.getUserMedia || 
          legacyNav.webkitGetUserMedia || 
          legacyNav.mozGetUserMedia || 
          legacyNav.msGetUserMedia;

        if (!legacyGetUserMedia) {
          throw new Error('getUserMedia not supported in this browser');
        }
        
        // Set up modern getUserMedia using legacy API
        navigator.mediaDevices.getUserMedia = function(constraints) {
          return new Promise((resolve, reject) => {
            legacyGetUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      
      // Try with more permissive constraints first
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        // Fallback to more specific constraints if simple request fails
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });
      }

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        // Stop the stream if MediaRecorder isn't available
        stream.getTracks().forEach(track => track.stop());
        throw new Error('MediaRecorder API not supported in this browser');
      }
      
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
    } catch (error: any) {
      console.error('Error starting recording:', error);
      let errorMessage = 'Could not access microphone';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Audio recording not supported in this browser.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Recording was aborted. Please try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Audio constraints could not be satisfied.';
      } else if (error.message.includes('MediaDevices API not supported')) {
        errorMessage = 'Your browser does not support audio recording. Please try a modern browser like Chrome, Firefox, or Safari.';
      } else if (error.message.includes('HTTPS')) {
        errorMessage = 'Audio recording requires a secure connection (HTTPS).';
      } else if (error.message.includes('MediaRecorder')) {
        errorMessage = 'Audio recording not supported in this browser. Please try Chrome, Firefox, or Safari.';
      }
      
      setRecordingError(errorMessage);
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
