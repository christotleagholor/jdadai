import { Image, Sparkles, Download, Share2, AlertCircle, Crown } from 'lucide-react';
import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { PremiumLimitContext } from '../limitContext/LimitContext';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImage = () => {

  const { limit, setPremiumLimit, isPremium, loading: contextLoading, checkFeatureAccess } = useContext(PremiumLimitContext)
  
  const imageStyle = [
    'Realistic', 'Ghibli style', 'Anime style', 'Cartoon style', 
    'Fantasy style', '3D style', 'Portrait style'
  ]
    
  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0]);
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();
  const { user } = useUser();

  // Check feature access
  const featureAccess = checkFeatureAccess?.('image') || { hasAccess: isPremium, remaining: isPremium ? Infinity : (3 - limit) };
  const hasAccess = featureAccess.hasAccess;
  const creditsLeft = featureAccess.remaining;
  const isCreditsRemaining = hasAccess && creditsLeft > 0;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please describe the image you want to generate');
      return;
    }
    
    // Check if user has access
    if (!hasAccess) {
      if (!isPremium) {
        toast.error('Image generation is a premium feature. Upgrade to Pro to generate images.');
      } else {
        toast.error('You have reached your monthly limit. Upgrade or wait for next month.');
      }
      return;
    }
    
    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in ${selectedStyle}`
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (data.success) {
        setContent(data.content)
        toast.success('Image generated successfully!')
        
        // Only increment usage for non-premium users
        if (!isPremium && setPremiumLimit) {
          await setPremiumLimit();
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to generate image')
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
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (err) {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Image URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  // Show loading state while checking subscription
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Image Generator</h1>
                <p className="text-sm text-gray-500 mt-0.5">Create stunning images from text descriptions</p>
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
                  Free Plan - {creditsLeft} credits left
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel - Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h2 className="font-semibold text-white">Image Settings</h2>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="p-6 space-y-5">
              {/* Image Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Describe your image
                </label>
                <textarea 
                  rows={4} 
                  onChange={(e) => setInput(e.target.value)} 
                  value={input} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm resize-none" 
                  placeholder="e.g., A serene landscape with mountains and a lake at sunset..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Be specific for better results
                </p>
              </div>

              {/* Image Style */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Select style
                </label>
                <div className="flex gap-2 flex-wrap">
                  {imageStyle.map((item, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedStyle(item)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer ${
                        selectedStyle === item 
                          ? 'bg-green-600 text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public Toggle - Premium only */}
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input 
                    type='checkbox' 
                    onChange={(e) => setPublish(e.target.checked)} 
                    checked={publish} 
                    disabled={!isPremium}
                    className='sr-only peer'
                  />
                  <div className={`w-10 h-5 rounded-full transition-all ${
                    publish && isPremium 
                      ? 'bg-green-500' 
                      : !isPremium 
                        ? 'bg-gray-300 opacity-50' 
                        : 'bg-gray-300 peer-checked:bg-green-500'
                  }`}>
                    <span className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all ${
                      publish && isPremium ? 'translate-x-5' : ''
                    }`}></span>
                  </div>
                </label>
                <span className="text-sm text-gray-600">
                  Make this image public
                  {!isPremium && <span className="text-xs text-gray-400 ml-1">(Premium feature)</span>}
                </span>
              </div>

              {/* Premium Upgrade Notice for non-premium */}
              {!isPremium && (
                <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <Crown className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-purple-700 font-medium">Premium Feature</p>
                    <p className="text-xs text-purple-600 mt-0.5">
                      Image generation is a premium feature. Upgrade to Pro for unlimited generations!
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

              {/* Credit Warning for non-premium with no credits */}
              {!isPremium && !isCreditsRemaining && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600">
                    You've used all your free credits. Upgrade to premium for unlimited image generation.
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button 
                disabled={loading || !input.trim() || (!isPremium && !isCreditsRemaining)} 
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  loading || !input.trim() || (!isPremium && !isCreditsRemaining)
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel - Generated Image */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-green-400" />
                  <h2 className="font-semibold text-white">Generated Image</h2>
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
                      onClick={handleShare}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 min-h-[500px] max-h-[600px] overflow-y-auto bg-gray-50">
              {!content ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Image className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Describe an image and click "Generate Image"<br />to see your creation here
                  </p>
                  {!isPremium && (
                    <p className="text-xs text-gray-400 mt-3">
                      Free users have {3 - (limit || 0)} generations remaining
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden bg-white shadow-md">
                  <img 
                    src={content} 
                    alt="Generated AI image" 
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

export default GenerateImage