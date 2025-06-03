/**
 * Application configuration settings
 */

// Speech service configurations
export const SPEECH_SERVICES = {
  DEFAULT: 'whisper', // Default speech service
  AVAILABLE: ['whisper', 'google', 'azure'] as const,
};

// Audio configuration
export const AUDIO_CONFIG = {
  MAX_RECORDING_DURATION_SECONDS: 300, // 5 minutes
  DEFAULT_SAMPLE_RATE: 16000,
  DEFAULT_CHANNELS: 1,
  MAX_UPLOAD_SIZE_MB: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '50', 10),
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'audio/mp3,audio/mpeg,audio/wav,audio/webm,audio/ogg,video/mp4').split(','),
};

// Transcription configuration
export const TRANSCRIPTION_CONFIG = {
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_MODEL: 'base',
  DEFAULT_SERVICE: 'whisper',
  AVAILABLE_MODELS: ['tiny', 'base', 'small', 'medium', 'large'] as const,
  MAX_SEGMENTS: 5000,
};

// API settings
export const API_CONFIG = {
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },
  TIMEOUT_MS: 30000, // 30 seconds
};

// Feature flags
export const FEATURES = {
  ENABLE_LIVE_TRANSCRIPTION: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_EDITING: true,
  ENABLE_EXPORT: true,
  ENABLE_DARK_MODE: true,
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'voice2text-theme',
  LAST_TRANSCRIPTION: 'voice2text-last-transcription',
  LANGUAGE_PREFERENCE: 'voice2text-language',
};

// Whisper model URLs
export const WHISPER_MODEL_URLS = {
  'tiny': 'https://cdn.example.com/models/whisper-tiny.bin',
  'base': 'https://cdn.example.com/models/whisper-base.bin',
  'small': 'https://cdn.example.com/models/whisper-small.bin',
  'medium': 'https://cdn.example.com/models/whisper-medium.bin',
  'large': 'https://cdn.example.com/models/whisper-large.bin',
};
