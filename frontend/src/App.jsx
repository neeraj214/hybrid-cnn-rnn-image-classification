import React from 'react';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600 tracking-tight">
                Hybrid CNN-RNN Classifier
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 text-gray-600 font-medium">
                <span className="cursor-default hover:text-blue-500 transition-colors">Home</span>
                <span className="cursor-default hover:text-blue-500 transition-colors">Architecture</span>
                <span className="cursor-default hover:text-blue-500 transition-colors">Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Welcome to the Hybrid Model Interface
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              This system combines Convolutional Neural Networks for feature extraction 
              and Recurrent Neural Networks for sequential analysis in image classification tasks.
            </p>
            
            {/* Image Upload Component */}
            <ImageUpload />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; 2026 Hybrid CNN-RNN Project. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a 
                href="https://github.com/neeraj214/hybrid-cnn-rnn-image-classification" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-blue-600 transition-colors"
              >
                <span>View on GitHub</span>
                <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
