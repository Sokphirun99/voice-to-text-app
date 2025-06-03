import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Singleton for FFmpeg instance
let ffmpeg: FFmpeg | null = null;

/**
 * Initialize FFmpeg for audio processing
 */
async function initializeFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  // Check if FFmpeg is already loaded
  if (!ffmpeg.loaded) {
    try {
      // Load FFmpeg wasm binary
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      });
    } catch (error) {
      console.error('Error initializing FFmpeg:', error);
      throw new Error('Failed to load FFmpeg');
    }
  }
  
  return ffmpeg;
}

/**
 * Convert an audio file to WAV format for better compatibility with STT services
 */
export async function convertToWAV(audioFile: File | Blob): Promise<Blob> {
  try {
    // Convert Blob to File if needed
    const file = audioFile instanceof File 
      ? audioFile 
      : new File([audioFile], 'recording.webm', { type: audioFile.type });
    
    // Check if it's already a WAV file
    if (file.type === 'audio/wav') {
      return file;
    }
    
    // Initialize FFmpeg if needed
    const ffmpeg = await initializeFFmpeg();
    
    // Create a file URL for the input file
    const fileArrayBuffer = await file.arrayBuffer();
    const fileName = 'input.' + (file.type.split('/')[1] || 'webm');
    
    // Write file to FFmpeg's virtual file system
    ffmpeg.writeFile(fileName, new Uint8Array(fileArrayBuffer));
    
    // Convert the file to WAV
    await ffmpeg.exec([
      '-i', fileName,
      '-c:a', 'pcm_s16le',
      '-ar', '16000', // 16kHz sample rate (good for STT)
      '-ac', '1',     // Mono audio
      'output.wav'
    ]);
    
    // Read the output WAV file
    const outputData = await ffmpeg.readFile('output.wav');
    
    // Create a Blob from the output data
    return new Blob([outputData], { type: 'audio/wav' });
  } catch (error) {
    console.error('Error converting audio:', error);
    // If conversion fails, return the original file
    return audioFile;
  }
}

/**
 * Normalize audio volume (make quiet recordings louder)
 */
export async function normalizeAudioVolume(audioBlob: Blob): Promise<Blob> {
  try {
    // Initialize FFmpeg if needed
    const ffmpeg = await initializeFFmpeg();
    
    // Create a file URL for the input file
    const fileArrayBuffer = await audioBlob.arrayBuffer();
    const fileName = 'input.wav';
    
    // Write file to FFmpeg's virtual file system
    ffmpeg.writeFile(fileName, new Uint8Array(fileArrayBuffer));
    
    // Apply normalization filter
    await ffmpeg.exec([
      '-i', fileName,
      '-af', 'loudnorm=I=-16:LRA=11:TP=-1.5',
      '-ar', '16000', // 16kHz sample rate
      '-ac', '1',     // Mono audio
      'normalized.wav'
    ]);
    
    // Read the normalized audio file
    const outputData = await ffmpeg.readFile('normalized.wav');
    
    // Create a Blob from the output data
    return new Blob([outputData], { type: 'audio/wav' });
  } catch (error) {
    console.error('Error normalizing audio:', error);
    // If normalization fails, return the original blob
    return audioBlob;
  }
}

/**
 * Process audio for transcription (format conversion and normalization)
 */
export async function processAudioForTranscription(audioFile: File | Blob): Promise<Blob> {
  try {
    // First convert to WAV
    const wavBlob = await convertToWAV(audioFile);
    
    // Then normalize the volume
    // return await normalizeAudioVolume(wavBlob);
    
    // Skip normalization for now as it might be resource-intensive in the browser
    return wavBlob;
  } catch (error) {
    console.error('Error processing audio:', error);
    // If processing fails, return the original file as a blob
    return audioFile instanceof File ? new Blob([await audioFile.arrayBuffer()], { type: audioFile.type }) : audioFile;
  }
}
