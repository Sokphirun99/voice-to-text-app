'use client';

import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (!waveformRef.current) return;
    
    const initializeWaveSurfer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Clean up existing instance
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
        
        // Create WaveSurfer instance
        const WaveSurfer = (await import('wavesurfer.js')).default;
        const wavesurfer = WaveSurfer.create({
          container: waveformRef.current!,
          waveColor: '#4f46e5',
          progressColor: '#818cf8',
          cursorColor: '#3730a3',
          barWidth: 2,
          barGap: 3,
          barRadius: 3,
          height: 80,
          normalize: true,
          responsive: true,
        });
        
        wavesurferRef.current = wavesurfer;
        
        // Load audio
        wavesurfer.load(audioUrl);
        
        // Event listeners
        wavesurfer.on('ready', () => {
          setIsLoading(false);
          setDuration(wavesurfer.getDuration());
        });
        
        wavesurfer.on('audioprocess', () => {
          setCurrentTime(wavesurfer.getCurrentTime());
        });
        
        wavesurfer.on('play', () => setIsPlaying(true));
        wavesurfer.on('pause', () => setIsPlaying(false));
        wavesurfer.on('finish', () => setIsPlaying(false));
        
        wavesurfer.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          setError('Error loading audio file');
          setIsLoading(false);
          
          // Fallback to HTML audio
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
          }
        });
      } catch (err) {
        console.error('Error initializing WaveSurfer:', err);
        setError('Could not initialize audio player');
        setIsLoading(false);
      }
    };
    
    initializeWaveSurfer();
    
    // Cleanup function
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioUrl]);
  
  const togglePlayback = () => {
    if (!wavesurferRef.current) return;
    
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
  };
  
  const handleAudioTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (!wavesurferRef.current) return;
    
    wavesurferRef.current.seekTo(newTime / duration);
    setCurrentTime(newTime);
  };
  
  // Format time in MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Fallback player if waveform fails
  const handleFallbackPlayPause = () => {
    if (!audioRef.current) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  return (
    <div className="w-full">
      <div ref={waveformRef} className={error ? 'hidden' : 'mb-4'}></div>
      
      {isLoading && !error && (
        <div className="h-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading audio...</span>
        </div>
      )}
      
      {error && (
        <div>
          {/* Fallback audio player */}
          <audio 
            ref={audioRef} 
            className="w-full mb-2" 
            controls 
            src={audioUrl}
            onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
            onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
            onError={() => setError('Could not load audio file')}
          >
            Your browser does not support the audio element.
          </audio>
          
          <p className="text-amber-600 text-sm">{error}</p>
        </div>
      )}
      
      {!error && (
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white focus:outline-none"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="text-sm font-mono w-16 text-right">
            {formatTime(currentTime)}
          </div>
          
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            step="0.01"
            onChange={handleAudioTimeChange}
            disabled={isLoading || duration === 0}
            className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="text-sm font-mono w-16">
            {formatTime(duration)}
          </div>
        </div>
      )}
    </div>
  );
}
