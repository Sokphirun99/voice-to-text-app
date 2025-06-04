'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            <span className="block">Convert Speech to Text</span>
            <span className="block text-indigo-600 dark:text-indigo-400">In Seconds</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-5 text-xl text-gray-500 dark:text-gray-300">
            Accurate voice transcription powered by advanced AI. Upload audio files or record directly in your browser.
          </p>
          <div className="mt-10">
            <Link 
              href="/#get-started"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Get Started
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ml-2 transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="get-started" className="py-12">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Record Audio</h3>
                <p className="text-base text-gray-500 dark:text-gray-300 text-center">
                  Use our intuitive recording interface to capture high-quality audio directly from your device.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Upload Files</h3>
                <p className="text-base text-gray-500 dark:text-gray-300 text-center">
                  Drag and drop your audio or video files for instant transcription. Supports MP3, WAV, and more.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Get Results</h3>
                <p className="text-base text-gray-500 dark:text-gray-300 text-center">
                  Receive accurate transcriptions in seconds. Export as TXT, SRT, VTT, or JSON formats.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to get started?</h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our AI-powered transcription service for accurate, fast results.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Transcribing Now
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Voice to Text App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
