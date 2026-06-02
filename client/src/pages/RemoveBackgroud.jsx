import { Eraser, Sparkles, Upload, Download, Image as ImageIcon, AlertCircle, X } from 'lucide-react';
import React, { useContext, useState, useRef } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { PremiumLimitContext } from '../limitContext/LimitContext';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const { limit, setPremiumLimit } = useContext(PremiumLimitContext)

  const [input, setInput] = useState(null)
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(null);
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

  const handleClearImage = () => {
    setInput(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input) {
      toast.error('Please select an image to process');
      return;
    }
    
    try {
      // limit check
      if (limit >= 3) {
        toast.error('You have a maximum of 3 credits to explore premium features such as image generation, background removal, and object removal. These limitations are in place because the demo relies on free-tier APIs.');
        return
      }
      setPremiumLimit()
      setLoading(true);

      const formData = new FormData();
      formData.append('image', input);
      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        }
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Background removed successfully!')
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
      link.download = `background-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (err) {
      toast.error('Failed to download image');
    }
  }

  const handleReset = () => {
    setContent('');
    setPreview(null);
    setInput(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const creditsLeft = 3 - (limit || 0);
  const isCreditsRemaining = creditsLeft > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Eraser className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Background Remover</h1>
                <p className="text-sm text-gray-500 mt-0.5">Remove image backgrounds instantly with AI</p>
              </div>
            </div>
            
            {/* Credits Badge */}
            <div className={`px-3 py-1.5 rounded-lg text-sm ${
              isCreditsRemaining ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className="font-medium">{creditsLeft} / 3</span> credits remaining
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel - Upload Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-orange-500" />
                <h2 className="font-semibold text-gray-800">Upload Image</h2>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="p-5 space-y-5">
              {/* Upload Area */}
              <div>
                {!preview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
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
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full rounded-lg border border-gray-200 object-cover max-h-64"
                    />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Warning for credits */}
              {!isCreditsRemaining && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600">
                    You've used all your credits. Upgrade to premium to remove more backgrounds.
                  </p>
                </div>
              )}

              {/* Process Button */}
              <button 
                disabled={loading || !input || !isCreditsRemaining} 
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  loading || !input || !isCreditsRemaining
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Eraser className="w-4 h-4" />
                    <span>Remove Background</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel - Result Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eraser className="w-4 h-4 text-orange-500" />
                  <h2 className="font-semibold text-gray-800">Processed Image</h2>
                </div>
                {content && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-5 min-h-[400px] max-h-[500px] overflow-y-auto">
              {!content ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Eraser className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Upload an image and click "Remove Background"<br />to see the result here
                  </p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={content} 
                    alt="Background removed" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveBackground