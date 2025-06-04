'use client';

import { useState, useEffect, useRef } from 'react';
import useAudioRecorder from '@/app/hooks/useAudioRecorder';
import { checkBrowserCompatibility, logBrowserCompatibility, isInVSCodeBrowser } from '@/app/lib/utils/browserCompat';

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
        // Log browser compatibility (only logs once due to the utility function's design)
        logBrowserCompatibility();
        const compat = checkBrowserCompatibility();
        
        // Handle VS Code browser specifically
        if (compat.isVSCodeBrowser) {
          console.log('VS Code Simple Browser detected - using fallback UI');
          setRecordingPermission(false);
          return;
        }
        
        // For non-VS Code browsers, check if audio recording is supported
        if (!compat.isSupported) {
          // Don't console.error here - we've already logged in the utility
          setRecordingPermission(false);
          return;
        }

        // Check if basic APIs are available
        if (!navigator.mediaDevices) {
          setRecordingPermission(false);
          return;
        }

        // Try to set up getUserMedia (with fallbacks)
        if (!navigator.mediaDevices.getUserMedia) {
          const legacyNav = navigator as any;
          const legacyGetUserMedia = legacyNav.getUserMedia || 
            legacyNav.webkitGetUserMedia || 
            legacyNav.mozGetUserMedia || 
            legacyNav.msGetUserMedia;

          if (!legacyGetUserMedia) {
            setRecordingPermission(false);
            return;
          }
          
          // Polyfill getUserMedia
          navigator.mediaDevices.getUserMedia = function(constraints) {
            return new Promise((resolve, reject) => {
              legacyGetUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }

        // Check MediaRecorder support
        if (!window.MediaRecorder) {
          setRecordingPermission(false);
          return;
        }

        // Check permission status
        if ('permissions' in navigator) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            
            if (permissionStatus.state === 'granted') {
              setRecordingPermission(true);
            } else if (permissionStatus.state === 'denied') {
              setRecordingPermission(false);
            } else {
              setRecordingPermission(null); // Prompt state
            }
          } catch (permErr) {
            // Fallback to prompt state if permissions API fails
            setRecordingPermission(null);
          }
        } else {
          // No permissions API, default to prompt state
          setRecordingPermission(null);
        }
      } catch (err) {
        console.warn('Error during permission check:', err);
        setRecordingPermission(null);
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
  
  const handleStartRecording = async () => {
    // If permission is null (prompt state), request permission first
    if (recordingPermission === null) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setRecordingPermission(true);
      } catch (err) {
        console.error('Microphone permission denied during recording attempt:', err);
        setRecordingPermission(false);
        return;
      }
    }

    // If permission is still denied, don't proceed
    if (recordingPermission === false) {
      return;
    }

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
    const compat = checkBrowserCompatibility();
    const isVSCodeEnv = isInVSCodeBrowser();
    
    return (
      <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700/30 text-center shadow-lg backdrop-blur-sm">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
          {isVSCodeEnv ? (
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 8.25V6C16.5 4.75736 15.4926 3.75 14.25 3.75H4.5C3.25736 3.75 2.25 4.75736 2.25 6V18C2.25 19.2426 3.25736 20.25 4.5 20.25H14.25C15.4926 20.25 16.5 19.2426 16.5 18V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21.75 12L8.25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8.25L8.25 12L12 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          )}
        </div>
        
        {isVSCodeEnv ? (
          <>
            <h3 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-2">
              VS Code Browser Detected
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              The VS Code Simple Browser doesn't support audio recording. Use one of these options instead:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Option 1: External Browser</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Open this app in your default browser for full audio recording functionality.
                </p>
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                >
                  Open in External Browser
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Option 2: File Upload</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Record audio with another app and upload the file for transcription.
                </p>
                <button
                  onClick={() => {
                    // Scroll to file uploader section
                    document.getElementById('file-uploader-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                >
                  Go to File Upload
                </button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              VS Code Simple Browser has limited access to browser APIs for security reasons.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-2">
              Browser Compatibility Issue
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Your browser doesn't fully support audio recording. Here's what you can do:
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-left mb-4">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Recommendations:</h4>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                {compat.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>Use the file upload option below instead</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => {
                // Scroll to file uploader section
                document.getElementById('file-uploader-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
            >
              Go to File Upload
            </button>
          </>
        )}
      </div>
    );
  }

  if (recordingPermission === null) {
    return (
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/30 text-center">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <p className="font-bold text-blue-900 dark:text-blue-300 mb-2">Microphone Permission Needed</p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">Click the record button below to grant microphone access and start recording.</p>
        <button
          onClick={handleStartRecording}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          Grant Permission & Start Recording
        </button>
      </div>
    );
  }
  
  // Show recording error if any
  if (recordingError) {
    return (
      <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/30 text-center">
        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">Recording Error</p>
        <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-4">{recordingError}</p>
        <button
          onClick={handleStartRecording}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer pulse ring */}
        <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-400/30 to-pink-400/30 animate-ping' 
            : 'bg-gradient-to-r from-indigo-400/20 to-purple-400/20'
        }`} style={{ width: '200px', height: '200px' }}></div>
        
        {/* Middle ring */}
        <div className={`absolute rounded-full transition-all duration-700 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-400/40 to-pink-400/40 animate-pulse' 
            : 'bg-gradient-to-r from-indigo-400/30 to-purple-400/30'
        }`} style={{ width: '160px', height: '160px' }}></div>
        
        {/* Main button */}
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={recordingPermission === null}
          className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-2xl ${
            isRecording 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:ring-red-300' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-indigo-300'
          } ${recordingPermission === null ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </div>
      
      {isRecording && (
        <div className="text-center bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-red-200/50 dark:border-red-700/30">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {formatTime(recordingDuration)}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Recording in progress...</p>
        </div>
      )}
      
      {!isRecording && !recordingBlob && (
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Ready to Record</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click the microphone to start</p>
        </div>
      )}
      
      {recordingError && (
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-700/30">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 dark:text-red-400 font-medium">Error: {recordingError}</p>
          </div>
        </div>
      )}
      
      {!isRecording && isRecordingAvailable && !recordingBlob && (
        <div className="mt-6 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/30">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Processing recording...</span>
        </div>
      )}
    </div>
  );
}
