#!/usr/bin/env node

/**
 * Simple script to create a test audio file for testing the voice-to-text application
 */

const fs = require('fs');
const path = require('path');

// Create a minimal WAV file with silence (44.1kHz, 16-bit, mono, 3 seconds)
function createTestWavFile(outputPath, durationSeconds = 3) {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const fileSize = 44 + dataSize;

  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  // WAV Header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;
  
  // fmt chunk
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4; // chunk size
  buffer.writeUInt16LE(1, offset); offset += 2;  // audio format (PCM)
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), offset); offset += 4; // byte rate
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), offset); offset += 2; // block align
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;
  
  // data chunk
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;
  
  // Fill with silence (zeros)
  buffer.fill(0, offset);

  fs.writeFileSync(outputPath, buffer);
  console.log(`Created test audio file: ${outputPath}`);
  console.log(`Duration: ${durationSeconds} seconds`);
  console.log(`File size: ${Math.round(fileSize / 1024)} KB`);
}

// Create test directory if it doesn't exist
const testDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Create test audio file
const testAudioPath = path.join(testDir, 'test-audio.wav');
createTestWavFile(testAudioPath, 3);
