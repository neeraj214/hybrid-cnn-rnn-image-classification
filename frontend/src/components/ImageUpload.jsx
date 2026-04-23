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
        className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          previewUrl 
            ? 'border-blue-400 bg-blue-50/30' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
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
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="p-4 bg-blue-50 rounded-full text-blue-500 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Click or drag image here</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, or JPEG (Max 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-contain rounded-lg shadow-sm bg-white"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
              <p className="text-white font-medium">Click to change image</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={handleClassify}
          disabled={!selectedImage || loading}
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center space-x-2 ${
            selectedImage && !loading
              ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-blue-200 active:scale-95'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{loading ? 'Classifying...' : 'Classify Image'}</span>
        </button>

        {error && (
          <p className="mt-4 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
