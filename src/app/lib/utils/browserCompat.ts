// Browser compatibility checks for audio recording

// Extend Navigator interface for legacy getUserMedia methods
interface LegacyNavigator extends Navigator {
  getUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: any) => void
  ) => void;
  webkitGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: any) => void
  ) => void;
  mozGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: any) => void
  ) => void;
  msGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: any) => void
  ) => void;
}

export interface BrowserCompatibility {
  isSupported: boolean;
  features: {
    mediaDevices: boolean;
    getUserMedia: boolean;
    mediaRecorder: boolean;
    secureContext: boolean;
    permissions: boolean;
  };
  userAgent: string;
  isVSCodeBrowser: boolean;
  recommendations: string[];
}

// Global variable to prevent multiple checks and console logs
let compatibilityChecked = false;

/**
 * Detects if running in VS Code's Simple Browser
 */
export function isInVSCodeBrowser(): boolean {
  // Check for VS Code in user agent
  const isVSCodeInUA = navigator.userAgent.includes('VSCode');
  
  // Check for VS Code query parameters
  const hasVSCodeParam = window.location.search.includes('vscodeBrowserReqId');
  
  // Check for specific VS Code environment variables
  const hasVSCodeOrigin = window.origin.includes('vscode-webview');
  
  return isVSCodeInUA || hasVSCodeParam || hasVSCodeOrigin;
}

/**
 * Checks browser compatibility for audio recording features
 */
export function checkBrowserCompatibility(): BrowserCompatibility {
  const legacyNav = navigator as LegacyNavigator;
  const isVSCode = isInVSCodeBrowser();
  
  // Always consider localhost and VS Code as secure for our purposes
  const isLocalhost = window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0';
  const isHttps = window.location.protocol === 'https:';
  
  // Force secure context to true for VS Code browser and localhost
  const secureContext = isVSCode || window.isSecureContext || isHttps || isLocalhost;
  
  // More lenient feature detection for VS Code browser
  const features = {
    mediaDevices: isVSCode ? true : !!navigator.mediaDevices,
    getUserMedia: isVSCode ? true : !!(navigator.mediaDevices?.getUserMedia || 
      legacyNav.getUserMedia || 
      legacyNav.webkitGetUserMedia || 
      legacyNav.mozGetUserMedia || 
      legacyNav.msGetUserMedia),
    mediaRecorder: isVSCode ? true : !!window.MediaRecorder,
    secureContext: secureContext,
    permissions: isVSCode ? true : !!navigator.permissions
  };

  const recommendations: string[] = [];
  
  // Only add recommendations if not in VS Code (since we handle that specially)
  if (!isVSCode) {
    if (!features.secureContext) {
      recommendations.push('Use HTTPS or localhost for audio recording');
    }
    
    if (!features.mediaDevices) {
      recommendations.push('Update to a modern browser (Chrome 53+, Firefox 36+, Safari 11+)');
    }
    
    if (!features.getUserMedia) {
      recommendations.push('Enable microphone access in browser settings');
    }
    
    if (!features.mediaRecorder) {
      recommendations.push('Use Chrome, Firefox, or Safari for best audio recording support');
    }
  }

  // For VS Code browser, we'll always show our special UI regardless of detected features
  // For other browsers, we'll use the actual feature detection
  const isSupported = isVSCode ? false : (features.mediaDevices && 
                                         features.getUserMedia && 
                                         features.mediaRecorder && 
                                         features.secureContext);

  return {
    isSupported,
    features,
    userAgent: navigator.userAgent,
    isVSCodeBrowser: isVSCode,
    recommendations
  };
}

// Track if we've already logged to avoid duplicate messages
let hasLogged = false;

/**
 * Logs browser compatibility information to console (only once)
 */
export function logBrowserCompatibility(): void {
  if (hasLogged) return;
  
  const compat = checkBrowserCompatibility();
  
  console.group('🔍 Browser Compatibility Check');
  console.log('Supported:', compat.isSupported);
  
  if (compat.isVSCodeBrowser) {
    console.log('✓ VS Code Simple Browser detected');
    console.log('⚠️ Limited audio recording support in VS Code Simple Browser');
    console.log('ℹ️ Suggestion: Use file upload feature or open in external browser');
  } else {
    console.log('Features:', compat.features);
    console.log('User Agent:', compat.userAgent);
    if (compat.recommendations.length > 0) {
      console.log('Recommendations:', compat.recommendations);
    }
  }
  
  console.groupEnd();
  
  // Mark as logged to prevent duplicate messages
  hasLogged = true;
}
