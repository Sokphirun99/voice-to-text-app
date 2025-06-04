'use client';

import { useState, useEffect } from 'react';
import ExportMenu from './ExportMenu';

interface TranscriptionViewProps {
  text: string;
  transcriptionId: string;
}

export default function TranscriptionView({ text, transcriptionId }: TranscriptionViewProps) {
  const [transcription, setTranscription] = useState(text);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Reset state when text props change
  useEffect(() => {
    setTranscription(text);
    setIsEditing(false);
    setSaveStatus('idle');
  }, [text]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setTranscription(text);
    setIsEditing(false);
    setSaveStatus('idle');
  };
  
  const handleSave = async () => {
    if (transcription === text) {
      setIsEditing(false);
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Make API call to save the edited transcription
      const response = await fetch(`/api/transcribe?id=${transcriptionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save transcription');
      }
      
      setSaveStatus('success');
      setIsEditing(false);
      
      // Show success status briefly
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving transcription:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      alert('Transcription copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transcription Text</h2>
        </div>
        
        {/* Status indicators */}
        {saveStatus === 'success' && (
          <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm text-green-700 dark:text-green-400 animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved successfully
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-sm text-red-700 dark:text-red-400 animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Save failed
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className={`relative transition-all duration-300 ${
        isEditing 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-600 rounded-2xl shadow-lg' 
          : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl hover:shadow-2xl'
      }`}>
        {isEditing ? (
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="w-full min-h-[300px] p-6 bg-transparent resize-y focus:outline-none text-gray-900 dark:text-white text-lg leading-relaxed"
            placeholder="Edit your transcription here..."
            autoFocus
          />
        ) : (
          <div className="p-6">
            <div className="prose prose-lg max-w-none text-gray-900 dark:text-white">
              {transcription.split('\n').map((paragraph, index) => (
                <p key={index} className={`${paragraph.trim() === '' ? 'h-6' : 'mb-4 leading-relaxed'}`}>
                  {paragraph || '\u00A0'}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
        <div className="flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Text
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </button>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center">
            <ExportMenu transcriptionId={transcriptionId} />
          </div>
        )}
      </div>
    </div>
  );
}
