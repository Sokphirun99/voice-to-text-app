'use client';

import { useState, useRef, useEffect } from 'react';

interface ExportMenuProps {
  transcriptionId: string;
}

interface ExportFormat {
  id: string;
  label: string;
  extension: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'text', label: 'Plain Text', extension: 'txt' },
  { id: 'srt', label: 'SubRip Subtitle', extension: 'srt' },
  { id: 'vtt', label: 'WebVTT', extension: 'vtt' },
  { id: 'json', label: 'JSON', extension: 'json' },
];

export default function ExportMenu({ transcriptionId }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Add event listener when the menu opens
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = async (format: string) => {
    try {
      setIsExporting(true);
      setExportFormat(format);
      
      // Create a hidden link and trigger the download
      const link = document.createElement('a');
      link.href = `/api/export?id=${transcriptionId}&format=${format}`;
      link.download = `transcription-${transcriptionId}.${EXPORT_FORMATS.find(f => f.id === format)?.extension || 'txt'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 z-50 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              Export As
            </p>
            {EXPORT_FORMATS.map((format) => (
              <button
                key={format.id}
                onClick={() => handleExport(format.id)}
                disabled={isExporting}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                {isExporting && exportFormat === format.id ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>{format.label} (.{format.extension})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
