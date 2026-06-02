import { Edit, Sparkles, Copy, Check, FileText } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' }
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter an article topic');
      return;
    }
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`
      const { data } = await axios.post('/api/ai/generate-article', { prompt }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Article generated successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Article copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Article Writer</h1>
              <p className="text-sm text-gray-500 mt-0.5">Generate high-quality articles in seconds</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel - Input Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <h2 className="font-semibold text-gray-800">Article Settings</h2>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="p-5 space-y-5">
              {/* Topic Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  What topic would you like to write about?
                </label>
                <input 
                  type="text" 
                  onChange={(e) => setInput(e.target.value)} 
                  value={input} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                  placeholder="e.g., The future of artificial intelligence"
                  required
                />
              </div>

              {/* Article Length */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Select article length
                </label>
                <div className="flex gap-2 flex-wrap">
                  {articleLength.map((item, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedLength(item)}
                      className={`px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
                        selectedLength.text === item.text 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button 
                disabled={loading || !input.trim()} 
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  loading || !input.trim()
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Generate Article</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel - Generated Article */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4 text-blue-500" />
                  <h2 className="font-semibold text-gray-800">Generated Article</h2>
                </div>
                {content && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-5 min-h-[500px] max-h-[600px] overflow-y-auto">
              {!content ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Edit className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Enter a topic and click "Generate Article"<br />to see your content here
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="reset-tw text-gray-700">
                    <Markdown
                      components={{
                        h1: ({...props}) => <h1 className="text-xl font-bold text-gray-800 mb-3 mt-0" {...props} />,
                        h2: ({...props}) => <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-4" {...props} />,
                        h3: ({...props}) => <h3 className="text-base font-semibold text-gray-800 mb-2 mt-3" {...props} />,
                        p: ({...props}) => <p className="text-sm text-gray-600 mb-3 leading-relaxed" {...props} />,
                        ul: ({...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                        li: ({...props}) => <li className="text-sm text-gray-600" {...props} />,
                        strong: ({...props}) => <strong className="font-semibold text-gray-800" {...props} />,
                        code: ({...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
                      }}
                    >
                      {content}
                    </Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriteArticle