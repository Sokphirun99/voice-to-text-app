'use client';

import { ReactNode } from 'react';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import { AudioProvider } from '@/app/context/AudioContext';
import RecordingStatus from '@/app/components/audio/RecordingStatus';
import ErrorBoundary from '@/app/components/ui/ErrorBoundary';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <RecordingStatus />
        </div>
      </AudioProvider>
    </ErrorBoundary>
  );
}
