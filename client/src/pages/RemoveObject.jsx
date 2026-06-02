import { Scissors, Sparkles, Upload, Download, Image as ImageIcon, X, AlertCircle, ArrowRight, Check, Eye } from 'lucide-react';
import React, { useContext, useState, useRef } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { PremiumLimitContext } from '../limitContext/LimitContext';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {

  const { limit, setPremiumLimit } = useContext(PremiumLimitContext)

  const [input, setInput] = useState(null);
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const fileInputRef = useRef(null);

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setInput(null);
    setPreview(null);
    setContent('');
    setObject('');
    setShowOriginal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input) {
      toast.error('Please select an image');
      return;
    }
    
    if (!object.trim()) {
      toast.error('Please describe the object to remove');
      return;
    }
    
    try {
      if (limit >= 3) {
        toast.error('You have used all your free credits. Upgrade to premium for unlimited access.');
        return;
      }
      setPremiumLimit()
      setLoading(true);

      if (object.split(' ').length > 1) {
        toast.warn('Please enter only one object name!');
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        }
      })
      
      if (data.success) {
        setContent(data.content)
        toast.success('Object removed successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  const handleDownload = async () => {
    if (!content) return;
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `object-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image saved!');
    } catch (err) {
      toast.error('Failed to download');
    }
  }

  const creditsLeft = 3 - (limit || 0);
  const isCreditsRemaining = creditsLeft > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">AI Object Remover</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Remove Unwanted Objects
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Select any object in your image and our AI will magically erase it
          </p>
        </div>

        {/* Credit Status */}
        <div className="flex justify-center mb-8">
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            isCreditsRemaining ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isCreditsRemaining ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">{creditsLeft} of 3 free credits remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Image Editor</h2>
                  <p className="text-sm text-blue-100">Upload and select object to remove</p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="p-6 space-y-5">
              
              {/* Image Upload */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Upload Image</label>
                {!preview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Click to upload</p>
                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                      required
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full rounded-xl object-cover max-h-64"
                    />
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute top-3 right-3 w-8 h-8 bg-gray-800/70 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Object to Remove */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Object to Remove
                </label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={object}
                    onChange={(e) => setObject(e.target.value)}
                    placeholder="e.g., watch, spoon, person, car"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Enter only one object name for best results</p>
              </div>

              {/* Warning when no credits */}
              {!isCreditsRemaining && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    You've used all your free credits. Upgrade to premium to continue using object removal.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                disabled={loading || !input || !object.trim() || !isCreditsRemaining} 
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                  loading || !input || !object.trim() || !isCreditsRemaining
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Remove Object</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Result */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Result</h2>
                    <p className="text-sm text-green-100">Object removed image</p>
                  </div>
                </div>
                {content && preview && (
                  <button
                    type="button"
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-white transition-colors"
                  >
                    {showOriginal ? 'Show Result' : 'Show Original'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 min-h-[400px]">
              {!content ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Scissors className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Upload an image and specify the object<br />to see the result here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={showOriginal ? preview : content} 
                      alt={showOriginal ? "Original" : "Object removed"} 
                      className="w-full rounded-xl object-cover"
                    />
                  </div>
                  {!showOriginal && (
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Image</span>
                    </button>
                  )}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>AI processed successfully</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Pro Tips for Best Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-600 font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600">Use high-contrast images where the object stands out</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-600 font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">Be specific about the object name (e.g., "red cup" not just "cup")</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-600 font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600">For best results, ensure the object is clearly visible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveObject