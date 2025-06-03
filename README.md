# Voice-to-Text Converter

A modern web application for converting speech to text using advanced speech recognition technology.

## Features

- Real-time audio recording with visual feedback
- Drag-and-drop file uploads for audio transcription
- Support for multiple audio formats (MP3, WAV, OGG, WebM)
- Responsive design for desktop and mobile devices
- Dark mode support
- Editable transcription results
- Audio playback with waveform visualization

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
- `/app/api/*` - API endpoints for transcription and file storage
- `/components/*` - Reusable UI components
- `/hooks/*` - Custom React hooks
- `/lib/*` - Utility functions and services
- `/public/*` - Static assets

## Deployment

The application can be easily deployed to Vercel:

```bash
npx vercel
```

## License

MIT
