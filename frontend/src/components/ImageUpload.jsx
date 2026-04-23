import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUpload = ({ onResult }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleClassify = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onResult(response.data);
    } catch (err) {
      console.error('Classification error:', err);
      setError('Failed to classify image. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={triggerFileInput}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-10 transition-all duration-300 ${
          previewUrl 
            ? 'border-blue-500/50 bg-blue-500/5' 
            : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/*"
          className="hidden"
        />

        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-10">
            <div className="p-5 bg-slate-700/50 rounded-2xl text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-200">Drop your image here</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">or click to browse files</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-72 object-contain rounded-xl shadow-2xl bg-slate-900/50"
            />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <p className="text-white font-semibold text-sm">Replace Image</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={handleClassify}
          disabled={!selectedImage || loading}
          className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-white shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 ${
            selectedImage && !loading
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-1 hover:shadow-blue-500/25 active:scale-[0.98]'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600'
          }`}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span className="uppercase tracking-widest text-sm">
            {loading ? 'Analyzing...' : 'Start Classification'}
          </span>
        </button>

        {error && (
          <div className="mt-6 flex items-center space-x-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20 animate-in fade-in slide-in-from-top-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-bold tracking-wide uppercase">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
  );
};

export default ImageUpload;
