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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-500/25 to-purple-500/25 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl mb-8 shadow-2xl animate-pulse-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent animate-gradient-shift">
                Voice to Text
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-shift" style={{animationDelay: '0.5s'}}>
                Converter
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
              Experience the future of AI-powered transcription with our cutting-edge voice recognition technology
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/20">
                ✨ AI Powered
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/20">
                🚀 Real-time
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/20">
                🎯 99% Accuracy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Record Audio Section */}
          <div className="group animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 hover:scale-[1.02] hover:border-purple-500/50">
                {/* Icon header */}
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce-subtle"></div>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-3xl font-bold text-white mb-1">Record Audio</h2>
                    <p className="text-purple-200 text-sm">Live voice capture</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  Click the microphone and start speaking. Our advanced AI will capture every word with incredible precision.
                </p>
                
                <div className="flex justify-center">
                  <AudioRecorder 
                    onRecordingStart={() => setIsRecording(true)}
                    onRecordingComplete={handleRecordingComplete}
                  />
                </div>
                
                {/* Status indicator */}
                <div className="mt-6 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full mr-3 transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-sm text-gray-400">
                    {isRecording ? 'Recording in progress...' : 'Ready to record'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upload File Section */}
          <div className="group animate-fade-in" style={{animationDelay: '1s'}}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-700 hover:scale-[1.02] hover:border-blue-500/50">
                {/* Icon header */}
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow" style={{animationDelay: '1s'}}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-bounce-subtle" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-3xl font-bold text-white mb-1">Upload Audio</h2>
                    <p className="text-blue-200 text-sm">File transcription</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  Drag and drop your media files or browse to select. Supports all major audio and video formats.
                </p>
                
                <FileUploader onFileUpload={handleFileUpload} />
                
                {/* Format support */}
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {['MP3', 'WAV', 'MP4', 'M4A', 'FLAC'].map((format) => (
                    <span key={format} className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Processing Status */}
        {isTranscribing && (
          <div className="animate-fade-in">
            <div className="relative">
              {/* Animated background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-3xl blur-lg animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl mb-8">
                {/* Processing header */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 border-4 border-blue-400/50 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <div className="ml-8 text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">AI Processing</h3>
                    <p className="text-gray-300 text-lg">Advanced neural networks are transcribing your audio...</p>
                  </div>
                </div>
                
                {/* Progress section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-lg font-medium">Transcription Progress</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {Math.round(progress)}%
                      </span>
                      <div className="ml-3 flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-1000 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient-shift"></div>
                    </div>
                  </div>
                  
                  {/* Processing steps */}
                  <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                    <div className="space-y-2">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${progress > 20 ? 'bg-green-500' : 'bg-white/20'}`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-300">Audio Analysis</p>
                    </div>
                    <div className="space-y-2">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${progress > 60 ? 'bg-green-500' : 'bg-white/20'}`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-300">Speech Recognition</p>
                    </div>
                    <div className="space-y-2">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${progress > 90 ? 'bg-green-500' : 'bg-white/20'}`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-300">Text Generation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="animate-fade-in">
            <div className="relative">
              {/* Error glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 to-pink-500/50 rounded-3xl blur-lg"></div>
              
              <div className="relative bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-2xl mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-red-300 mb-1">Transcription Error</h3>
                    <p className="text-red-200 leading-relaxed">{error}</p>
                  </div>
                </div>
                
                {/* Retry suggestion */}
                <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
                  <p className="text-red-200 text-sm">
                    💡 Try recording again or uploading a different audio file. Make sure your audio is clear and in a supported format.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Success State */}
        {transcriptionId && !isTranscribing && (
          <div className="animate-fade-in">
            <div className="relative">
              {/* Success glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-3xl blur-lg animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-3xl p-10 border border-green-500/30 shadow-2xl text-center">
                {/* Success icon with animation */}
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {/* Celebration particles */}
                  <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
                </div>
                
                <h3 className="text-4xl font-bold text-white mb-4">🎉 Transcription Complete!</h3>
                <p className="text-gray-300 mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
                  Your audio has been successfully transformed into text with incredible accuracy. Ready to explore your transcription?
                </p>
                
                {/* CTA Button */}
                <Link 
                  href={`/app/results?id=${transcriptionId}`}
                  className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <svg className="w-6 h-6 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="relative z-10">View Transcription Results</span>
                  <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                {/* Stats or additional info */}
                <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-green-400 mb-1">99.8%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-blue-400 mb-1">&lt; 30s</div>
                    <div className="text-sm text-gray-400">Processing Time</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-purple-400 mb-1">AI</div>
                    <div className="text-sm text-gray-400">Powered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
