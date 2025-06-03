# Voice-to-Text Converter

A modern web application for converting speech to text using advanced speech recognition technology.

## Features

- Real-time audio recording with visual feedback
- Drag-and-drop file uploads for audio transcription
- Support for multiple audio formats (MP3, WAV, OGG, WebM)
- Responsive design for desktop and mobile devices
- Dark mode support with system preference detection
- Editable transcription results with save functionality
- Audio playback with waveform visualization
- Export transcriptions in multiple formats (TXT, SRT, VTT, JSON)
- Download original audio recordings
- Real-time transcription progress indicator

## Technologies Used

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Hooks for state management
- OpenAI Whisper API integration (optional)
- FFmpeg WebAssembly for audio processing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/voice-to-text-app.git
   cd voice-to-text-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   # Add your API keys for production
   # OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows a modular architecture:

- `/app/(main)/*` - Main application routes
- `/app/api/*` - API endpoints for transcription, export formats, and file storage
- `/components/*` - Reusable UI components organized by function
  - `/audio` - Audio recording and playback components
  - `/layout` - Layout components like Header and Footer
  - `/ui` - Reusable UI elements like buttons, export menu, etc.
- `/context/*` - React context providers for app state
- `/hooks/*` - Custom React hooks for shared logic
- `/lib/*` - Utility functions and services
  - `/services` - Integration with external APIs
  - `/utils` - Helper functions for audio processing, storage, etc.
- `/public/*` - Static assets

## Deployment

### Vercel Deployment

The application can be easily deployed to Vercel:

```bash
npx vercel
```

### Production Build

To create an optimized production build locally:

```bash
npm run build
npm start
```

### Environment Variables

For production deployments, you'll need to set these environment variables:

```
NEXT_PUBLIC_API_URL=your_production_url
NEXT_PUBLIC_MAX_AUDIO_DURATION=300
NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB=25
NEXT_PUBLIC_ALLOWED_FILE_TYPES=audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/m4a,audio/x-m4a,audio/webm,audio/ogg
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_DEFAULT_SERVICE=whisper
```

You can also add API keys for third-party services if using them:
```
# Optional API integrations
# OPENAI_API_KEY=your_openai_api_key
# GOOGLE_CLOUD_API_KEY=your_google_api_key
# AZURE_SPEECH_KEY=your_azure_speech_key
```

## Usage

### Recording Audio

1. Click the microphone button on the home page to start recording
2. Speak into your microphone - you'll see a waveform visualization
3. Click the stop button when finished
4. The app will automatically process your recording

### Uploading Audio Files

1. Click the upload button or drag and drop audio files
2. Supported formats: MP3, WAV, OGG, WebM, M4A
3. Maximum file size: 25MB (configurable)

### Viewing Transcriptions

After processing, you'll be taken to the results page where you can:
- Play back the audio with visualized waveform
- See and edit the transcription text
- View metadata about the recording 

### Export Options

The app supports multiple export formats:
1. **Plain Text (.txt)** - Simple text format
2. **SubRip (.srt)** - Subtitle format with timestamps
3. **WebVTT (.vtt)** - Web Video Text Tracks format
4. **JSON (.json)** - Structured format with all metadata

To export:
1. Click the "Export" button in the transcription view
2. Select your desired format
3. Your browser will download the file automatically

### Audio Download

You can download the original audio recording by clicking the "Download Audio" button in the audio player section.

## License

MIT
