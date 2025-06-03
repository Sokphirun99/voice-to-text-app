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
      <div className={`relative ${isEditing ? 'border-2 border-blue-300 rounded-md' : ''}`}>
        {isEditing ? (
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="w-full min-h-[200px] p-4 bg-transparent resize-y focus:outline-none"
            autoFocus
          />
        ) : (
          <div className="prose max-w-none p-4">
            {transcription.split('\n').map((paragraph, index) => (
              <p key={index} className={paragraph.trim() === '' ? 'h-4' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-between mt-4">
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 flex items-center space-x-1`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>Edit</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                </svg>
                <span>Copy</span>
              </button>
              <ExportMenu transcriptionId={transcriptionId} />
            </>
          )}
        </div>
        
        {saveStatus === 'success' && (
          <div className="flex items-center text-sm text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Changes saved successfully
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="flex items-center text-sm text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Failed to save changes
          </div>
        )}
      </div>
    </div>
  );
}
