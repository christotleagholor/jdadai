import { Eraser, Sparkles, Upload, Download, Image as ImageIcon, AlertCircle, X, Crown } from 'lucide-react';
import React, { useContext, useState, useRef } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth, useUser } from '@clerk/clerk-react';
import { PremiumLimitContext } from '../limitContext/LimitContext';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const { limit, setPremiumLimit, isPremium, loading: contextLoading, checkFeatureAccess } = useContext(PremiumLimitContext)

  const [input, setInput] = useState(null)
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const { getToken } = useAuth();
  const { user } = useUser();

  // Check feature access
  const featureAccess = checkFeatureAccess?.('background-removal') || { 
    hasAccess: isPremium, 
    remaining: isPremium ? Infinity : (3 - limit) 
  };
  const hasAccess = featureAccess.hasAccess;
  const creditsLeft = featureAccess.remaining;
  const isCreditsRemaining = hasAccess && creditsLeft > 0;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    setInput(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setInput(null);
    setPreview(null);
    setContent('');
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
    
    // Check if user has access
    if (!hasAccess) {
      if (!isPremium) {
        toast.error('Background removal is a premium feature. Upgrade to Pro to remove backgrounds.');
      } else {
        toast.error('You have reached your monthly limit. Upgrade or wait for next month.');
      }
      return;
    }
    
    try {
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
        
        // Only increment usage for non-premium users
        if (!isPremium && setPremiumLimit) {
          await setPremiumLimit();
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Background removal error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to remove background')
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

  // Show loading state while checking subscription
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Eraser className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Background Remover</h1>
                <p className="text-sm text-gray-500 mt-0.5">Remove image backgrounds instantly with AI</p>
              </div>
            </div>
            
            {/* Plan Badge */}
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              isPremium 
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isPremium ? (
                <span className="flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-yellow-500" />
                  Pro Plan - Unlimited
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Free Plan - {creditsLeft} credit{creditsLeft !== 1 ? 's' : ''} left
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel - Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-white" />
                <h2 className="font-semibold text-white">Upload Image</h2>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="p-6 space-y-5">
              {/* Upload Area */}
              <div>
                {!preview ? (
                  <div 
                    onClick={() => hasAccess && fileInputRef.current?.click()}
                    onDragEnter={hasAccess ? handleDrag : null}
                    onDragLeave={hasAccess ? handleDrag : null}
                    onDragOver={hasAccess ? handleDrag : null}
                    onDrop={hasAccess ? handleDrop : null}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                      !hasAccess
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : dragActive 
                          ? 'border-orange-500 bg-orange-50 cursor-pointer' 
                          : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          {!hasAccess 
                            ? 'No credits remaining' 
                            : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                      </div>
                      {!hasAccess && (
                        <button
                          type="button"
                          onClick={() => window.location.href = '/pricing'}
                          className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm hover:shadow-lg transition-all"
                        >
                          Upgrade to Pro
                        </button>
                      )}
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
                      className="w-full rounded-xl border border-gray-200 object-cover max-h-64"
                    />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Premium Upgrade Notice for non-premium */}
              {!isPremium && (
                <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <Crown className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-purple-700 font-medium">Premium Feature</p>
                    <p className="text-xs text-purple-600 mt-0.5">
                      Background removal is a premium feature. Upgrade to Pro for unlimited removals!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/pricing'}
                    className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              )}

              {/* Warning for non-premium with no credits */}
              {!isPremium && !isCreditsRemaining && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600">
                    You've used all your free background removals. Upgrade to premium for unlimited removals.
                  </p>
                </div>
              )}

              {/* Process Button */}
              <button 
                disabled={loading || !input || !hasAccess} 
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  loading || !input || !hasAccess
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eraser className="w-4 h-4 text-orange-400" />
                  <h2 className="font-semibold text-white">Processed Image</h2>
                </div>
                {content && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 min-h-[400px] max-h-[500px] overflow-y-auto bg-gray-50">
              {!content ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Eraser className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Upload an image and click "Remove Background"<br />to see the result here
                  </p>
                  {!isPremium && (
                    <p className="text-xs text-gray-400 mt-3">
                      Free users have {creditsLeft} background removal{creditsLeft !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden bg-white shadow-md">
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