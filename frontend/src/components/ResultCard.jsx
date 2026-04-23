import React from 'react';

const CIFAR10_CLASSES = [
  'airplane', 'automobile', 'bird', 'cat', 'deer',
  'dog', 'frog', 'horse', 'ship', 'truck'
];

const ResultCard = ({ label, confidence, allScores }) => {
  if (!label) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center border border-slate-700">
          <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-slate-300 font-bold text-lg">Waiting for input</p>
          <p className="text-slate-500 text-sm mt-1">Upload an image to see classification results</p>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (score) => {
    if (score >= 0.7) return 'bg-emerald-500 shadow-emerald-500/50';
    if (score >= 0.4) return 'bg-amber-500 shadow-amber-500/50';
    return 'bg-rose-500 shadow-rose-500/50';
  };

  const getConfidenceTextColor = (score) => {
    if (score >= 0.7) return 'text-emerald-400';
    if (score >= 0.4) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="w-full flex-grow flex flex-col transition-all duration-700 animate-in fade-in zoom-in-95">
      {/* Header with Main Result */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-xs font-black uppercase tracking-[0.2em] mb-2">Primary Classification</p>
            <h3 className="text-5xl font-black capitalize tracking-tight drop-shadow-lg">{label}</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 space-y-10 flex-grow bg-slate-800/20">
        {/* Confidence Section */}
        <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-700/50">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Model Confidence</span>
            <span className={`text-3xl font-black tabular-nums ${getConfidenceTextColor(confidence)}`}>
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-4 bg-slate-700 rounded-full p-1 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${getConfidenceColor(confidence)}`}
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>

        {/* All Scores Section */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <h4 className="text-white font-black text-sm uppercase tracking-widest">Class Probabilities</h4>
            <div className="h-[1px] flex-grow bg-slate-700/50"></div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {CIFAR10_CLASSES.map((className, index) => {
              const score = allScores ? allScores[index] : 0;
              const isTop = className === label;
              
              return (
                <div key={className} className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${isTop ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-slate-700/30 border border-transparent'}`}>
                  <span className={`capitalize text-sm font-bold ${isTop ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {className}
                  </span>
                  <div className="flex items-center space-x-4 w-3/5">
                    <div className="flex-grow h-1.5 bg-slate-700 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${isTop ? 'bg-blue-400' : 'bg-slate-500 opacity-30 group-hover:opacity-60'}`}
                        style={{ width: `${(score * 100).toFixed(2)}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs tabular-nums w-10 text-right font-black ${isTop ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                      {(score * 100).toFixed(1)}
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
