'use client';

import { ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { AudioProvider } from '../context/AudioContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </AudioProvider>
  );
}
