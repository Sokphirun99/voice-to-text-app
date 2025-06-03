import { TranscriptionSegment } from '@/app/types';

/**
 * Formats a transcription as plain text
 */
export function formatAsText(text: string): string {
  return text;
}

/**
 * Formats transcription segments as a SubRip (SRT) file
 */
export function formatAsSRT(segments: TranscriptionSegment[]): string {
  return segments
    .map((segment, index) => {
      const startTime = formatSRTTime(segment.start);
      const endTime = formatSRTTime(segment.end);
      
      return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
    })
    .join('\n');
}

/**
 * Formats transcription segments as a WebVTT file
 */
export function formatAsVTT(segments: TranscriptionSegment[]): string {
  const header = 'WEBVTT\n\n';
  
  const body = segments
    .map((segment, index) => {
      const startTime = formatVTTTime(segment.start);
      const endTime = formatVTTTime(segment.end);
      
      return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
    })
    .join('\n');
  
  return header + body;
}

/**
 * Formats transcription segments as JSON
 */
export function formatAsJSON(segments: TranscriptionSegment[]): string {
  return JSON.stringify(segments, null, 2);
}

/**
 * Converts seconds to SRT format (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const secs = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
  
  return `${hours}:${minutes}:${secs},${ms}`;
}

/**
 * Converts seconds to WebVTT format (HH:MM:SS.mmm)
 */
function formatVTTTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const secs = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
  
  return `${hours}:${minutes}:${secs}.${ms}`;
}

/**
 * Creates default segments from plain text if no segments are available
 */
export function createDefaultSegmentsFromText(text: string, duration: number = 60): TranscriptionSegment[] {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const segmentDuration = duration / lines.length;
  
  return lines.map((line, index) => {
    const start = index * segmentDuration;
    const end = (index + 1) * segmentDuration;
    
    return {
      id: index + 1,
      start,
      end,
      text: line,
    };
  });
}
