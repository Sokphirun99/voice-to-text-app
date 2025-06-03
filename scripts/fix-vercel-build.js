// This script helps fix issues with client reference manifests during Vercel deployment
const fs = require('fs');
const path = require('path');

// Function to ensure directories exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

// Function to create empty client reference manifest if missing
function createEmptyManifest(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `
// Auto-generated fallback manifest
self.__RSC_MANIFEST={
  "ssrModuleMapping": {},
  "edgeSSRModuleMapping": {},
  "clientModules": {},
  "entryCSSFiles": {}
};
    `.trim());
    console.log(`Created fallback manifest: ${filePath}`);
  }
}

// Main directories where client reference manifests should exist
const nextDir = path.join(process.cwd(), '.next', 'server');
const appDir = path.join(nextDir, 'app');
const mainDir = path.join(appDir, '(main)');

// Ensure directories exist
ensureDirectoryExists(nextDir);
ensureDirectoryExists(appDir);
ensureDirectoryExists(mainDir);

// Create client reference manifests if missing
createEmptyManifest(path.join(mainDir, 'page_client-reference-manifest.js'));

console.log('Build fix completed successfully!');
