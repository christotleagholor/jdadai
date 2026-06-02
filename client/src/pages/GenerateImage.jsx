import { Image, Sparkles, Download, Share2, AlertCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { PremiumLimitContext } from '../limitContext/LimitContext';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImage = () => {

  const { limit, setPremiumLimit } = useContext(PremiumLimitContext)
  
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please describe the image you want to generate');
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
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (err) {
      toast.error('Failed to download image');
    }
  }

  // Credit remaining calculation
  const creditsLeft = 3 - (limit || 0);
  const isCreditsRemaining = creditsLeft > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Image className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Image Generator</h1>
                <p className="text-sm text-gray-500 mt-0.5">Create stunning images from text descriptions</p>
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
          
          {/* Left Panel - Input Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                <h2 className="font-semibold text-gray-800">Image Settings</h2>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="p-5 space-y-5">
              {/* Image Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Describe your image
                </label>
                <textarea 
                  rows={4} 
                  onChange={(e) => setInput(e.target.value)} 
                  value={input} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm resize-none" 
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

              {/* Public Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input 
                    type='checkbox' 
                    onChange={(e) => setPublish(e.target.checked)} 
                    checked={publish} 
                    className='sr-only peer'
                  />
                  <div className='w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all'></div>
                  <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5'></span>
                </label>
                <span className="text-sm text-gray-600">Make this image public</span>
              </div>

              {/* Warning for credits */}
              {!isCreditsRemaining && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600">
                    You've used all your credits. Upgrade to premium to generate more images.
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button 
                disabled={loading || !input.trim() || !isCreditsRemaining} 
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  loading || !input.trim() || !isCreditsRemaining
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel - Generated Image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-green-500" />
                  <h2 className="font-semibold text-gray-800">Generated Image</h2>
                </div>
                {content && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-5 min-h-[500px] max-h-[600px] overflow-y-auto">
              {!content ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Describe an image and click "Generate Image"<br />to see your creation here
                  </p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden bg-gray-100">
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