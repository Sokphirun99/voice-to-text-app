'use client';

import { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const allowedFileTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'video/mp4'];
  const maxFileSize = 50 * 1024 * 1024; // 50 MB
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Check file type
    const isValidType = allowedFileTypes.includes(file.type) || file.type.startsWith('audio/');
    if (!isValidType) {
      setError('Invalid file type. Please upload an audio file.');
      return false;
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      setError(`File is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB.`);
      return false;
    }
    
    return true;
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const processFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Format the file size in KB or MB
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div id="file-uploader-section" className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-500 ${
          isDragging 
            ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 scale-105 shadow-2xl shadow-cyan-500/25' 
            : 'border-white/30 hover:border-cyan-400/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm'
        }`}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className={`absolute inset-0 transition-opacity duration-500 ${
            isDragging ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="absolute top-8 right-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute bottom-6 left-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <div className="absolute bottom-4 right-6 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="audio/*,video/*"
        />
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${
            isDragging 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-110 shadow-2xl' 
              : 'bg-gradient-to-r from-gray-500/50 to-gray-600/50 hover:from-cyan-500/50 hover:to-blue-500/50'
          }`}>
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            {isDragging ? '🎯 Drop your file here!' : '📁 Upload Audio File'}
          </h3>
          
          <p className="text-gray-300 mb-6 text-lg">
            {isDragging ? 'Release to start transcription' : 'Drag & drop your audio file or click to browse'}
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/20 flex-1"></div>
            <span className="text-sm text-gray-400 font-medium px-4 py-1 bg-white/10 rounded-full border border-white/20">OR</span>
            <div className="h-px bg-white/20 flex-1"></div>
          </div>
          
          <button
            type="button"
            onClick={handleBrowseClick}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <svg className="w-6 h-6 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z" />
            </svg>
            <span className="relative z-10">Browse Files</span>
          </button>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['MP3', 'WAV', 'OGG', 'WebM', 'MP4'].map((format) => (
              <span key={format} className="px-4 py-2 text-sm font-medium bg-white/10 text-gray-300 rounded-full border border-white/20 hover:bg-white/20 transition-colors duration-200">
                {format}
              </span>
            ))}
          </div>
          
          <p className="mt-4 text-sm text-gray-400">
            ✨ Maximum file size: 50MB • Supports all major audio & video formats
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-8 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 to-pink-500/50 rounded-3xl blur-lg"></div>
            <div className="relative p-6 bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-xl rounded-3xl border border-red-500/30">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300 font-medium text-lg">{error}</span>
              </div>
              <div className="mt-4 bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
                <p className="text-red-200 text-sm">
                  💡 Please try uploading a different file or check that your file meets the requirements above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedFile && !error && (
        <div className="mt-8 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-3xl blur-lg animate-pulse"></div>
            <div className="relative p-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-3xl border border-green-500/30">
              <div className="flex items-start">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-300 mb-2 text-xl">🎉 File Ready for Transcription</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-white truncate max-w-xs mb-1">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        📁 {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <div className="flex items-center text-green-400 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Ready to Process</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
