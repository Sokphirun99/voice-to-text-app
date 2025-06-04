'use client';

export default function TestStyles() {
  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">CSS Styles Debug Test</h1>
        
        {/* Test 1: Basic Tailwind Classes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Tailwind Test</h2>
          <p className="text-gray-600">If you see this styled correctly, basic Tailwind is working.</p>
        </div>

        {/* Test 2: Tailwind Gradients */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Tailwind Gradient Test</h2>
          <p className="text-white">This should have a purple to pink gradient background from Tailwind.</p>
        </div>

        {/* Test 3: Built-in Tailwind Animations */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg animate-pulse">
            <h3 className="font-bold">Pulse Animation</h3>
            <p className="text-sm">Should pulse/fade</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg animate-bounce">
            <h3 className="font-bold">Bounce Animation</h3>
            <p className="text-sm">Should bounce up/down</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg animate-spin">
            <h3 className="font-bold">Spin Animation</h3>
            <p className="text-sm">Should rotate continuously</p>
          </div>
        </div>

        {/* Test 4: Custom Animation Classes */}
        <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Fade-In Test</h2>
          <p className="text-gray-600">This should fade in if custom animations are working.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg animate-float">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Float Test</h2>
          <p className="text-gray-600">This should float up and down if custom animations are working.</p>
        </div>

        {/* Test 5: Hover Effects */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hover Effects Test</h2>
          <p className="text-gray-600">Hover over this to see scale and shadow effects.</p>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-800 text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <ul className="space-y-2 text-sm">
            <li>• If basic styling works: Tailwind CSS is loaded</li>
            <li>• If gradients work: Tailwind utilities are compiling</li>
            <li>• If built-in animations work: Tailwind animations are enabled</li>
            <li>• If custom animations work: Our custom config is active</li>
            <li>• Check browser console for any errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
