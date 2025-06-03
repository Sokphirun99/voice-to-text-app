'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface AudioContextProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  audioBlob: Blob | null;
  setAudioBlob: (blob: Blob | null) => void;
  transcription: string | null;
  setTranscription: (text: string | null) => void;
  transcriptionId: string | null;
  setTranscriptionId: (id: string | null) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  transcriptionProgress: number;
  setTranscriptionProgress: (progress: number) => void;
  transcriptionError: string | null;
  setTranscriptionError: (error: string | null) => void;
}

const defaultContext: AudioContextProps = {
  isRecording: false,
  setIsRecording: () => {},
  audioBlob: null,
  setAudioBlob: () => {},
  transcription: null,
  setTranscription: () => {},
  transcriptionId: null,
  setTranscriptionId: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  transcriptionProgress: 0,
  setTranscriptionProgress: () => {},
  transcriptionError: null,
  setTranscriptionError: () => {},
};

const AudioContext = createContext<AudioContextProps>(defaultContext);

export const useAudioContext = () => useContext(AudioContext);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [transcriptionId, setTranscriptionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  
  return (
    <AudioContext.Provider
      value={{
        isRecording,
        setIsRecording,
        audioBlob,
        setAudioBlob,
        transcription,
        setTranscription,
        transcriptionId,
        setTranscriptionId,
        isProcessing,
        setIsProcessing,
        transcriptionProgress,
        setTranscriptionProgress,
        transcriptionError,
        setTranscriptionError,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
