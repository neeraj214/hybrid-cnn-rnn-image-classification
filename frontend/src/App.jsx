import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ResultCard from './components/ResultCard';

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-blue-500/30">
      {/* Sticky Blurred Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                Hybrid CNN-RNN Classifier
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6 text-slate-400 font-medium">
                <span className="cursor-default hover:text-blue-400 transition-colors duration-200">Home</span>
                <span className="cursor-default hover:text-blue-400 transition-colors duration-200">Architecture</span>
                <span className="cursor-default hover:text-blue-400 transition-colors duration-200">Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Hybrid Model Interface
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Experience the power of our state-of-the-art hybrid architecture. 
              We combine <span className="text-blue-400 font-semibold">Convolutional Neural Networks</span> for spatial feature extraction 
              and <span className="text-indigo-400 font-semibold">Recurrent Neural Networks</span> for advanced sequential analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Image Upload Component */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
              <ImageUpload onResult={setResult} />
            </div>

            {/* Result Card Component */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
              <ResultCard 
                label={result?.label} 
                confidence={result?.confidence} 
                allScores={result?.all_scores} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p className="font-medium">&copy; 2026 Hybrid CNN-RNN Project. Built with React & Tailwind.</p>
            <div className="mt-6 md:mt-0">
              <a 
                href="https://github.com/neeraj214/hybrid-cnn-rnn-image-classification" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-full transition-all duration-300 border border-slate-700"
              >
                <span>View on GitHub</span>
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
