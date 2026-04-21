import React from 'react';

const CIFAR10_CLASSES = [
  'airplane', 'automobile', 'bird', 'cat', 'deer',
  'dog', 'frog', 'horse', 'ship', 'truck'
];

const ResultCard = ({ label, confidence, allScores }) => {
  if (!label) {
    return (
      <div className="w-full max-w-xl mx-auto mt-8 p-12 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50/50">
        <p className="text-gray-400 font-medium italic">Results will appear here after classification</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Header with Main Result */}
      <div className="bg-blue-600 p-6 text-white text-center">
        <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-1">Top Prediction</p>
        <h3 className="text-4xl font-black capitalize tracking-tight">{label}</h3>
      </div>

      <div className="p-8 space-y-8">
        {/* Confidence Section */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-gray-600 font-medium">Confidence Score</span>
            <span className="text-2xl font-bold text-blue-600">{(confidence * 100).toFixed(2)}%</span>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>

        {/* All Scores Section */}
        <div>
          <h4 className="text-gray-900 font-bold mb-4 border-b border-gray-100 pb-2">Probability Distribution</h4>
          <div className="grid grid-cols-1 gap-2">
            {CIFAR10_CLASSES.map((className, index) => {
              const score = allScores ? allScores[index] : 0;
              const isTop = className === label;
              
              return (
                <div key={className} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isTop ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <span className={`capitalize ${isTop ? 'font-bold text-blue-700' : 'text-gray-600'}`}>
                    {className}
                  </span>
                  <div className="flex items-center space-x-3 w-1/2">
                    <div className="flex-grow h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isTop ? 'bg-blue-500' : 'bg-gray-300'}`}
                        style={{ width: `${(score * 100).toFixed(2)}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs tabular-nums w-12 text-right ${isTop ? 'font-bold text-blue-700' : 'text-gray-400'}`}>
                      {(score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
