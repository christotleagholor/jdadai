import { Edit, Hash, Sparkles, Copy, Check, TrendingUp, Zap, BookOpen, Lightbulb } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {

  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'
  ]
  
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory} with maximum 10 titles`
      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  const handleCopyAll = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Titles copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50'>
      <div className='h-full overflow-y-auto p-6 lg:p-8'>
        
        {/* Page Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'>
              <Hash className='w-5 h-5 text-white' />
            </div>
            <div>
              <h1 className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
                AI Title Generator
              </h1>
              <p className='text-slate-500 text-sm mt-1'>Generate catchy blog titles with AI</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          
          {/* Left Column - Input Form */}
          <div className='w-full'>
            <form onSubmit={onSubmitHandler} className='bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
              
              {/* Form Header */}
              <div className='bg-gradient-to-r from-purple-50 to-pink-50 p-5 border-b border-slate-100'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                    <Sparkles className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-800'>Create Titles</h2>
                    <p className='text-xs text-slate-500'>Enter your topic and category</p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className='p-6 space-y-5'>
                {/* Keyword Input */}
                <div>
                  <label className='text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2'>
                    <Edit className='w-4 h-4 text-purple-500' />
                    Keyword / Topic
                  </label>
                  <input 
                    type="text" 
                    onChange={(e) => setInput(e.target.value)} 
                    value={input} 
                    className='w-full p-3 px-4 outline-none text-sm rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-slate-50/50' 
                    placeholder='e.g., The future of artificial intelligence...' 
                    required
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className='text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3'>
                    <BookOpen className='w-4 h-4 text-purple-500' />
                    Category
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {blogCategories.map((item, index) => (
                      <span 
                        className={`text-xs px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                          selectedCategory === item 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-200' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`} 
                        key={index} 
                        onClick={() => setSelectedCategory(item)}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button 
                  disabled={loading || !input.trim()} 
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    loading || !input.trim() 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className='w-5 h-5' />
                      <span>Generate Titles</span>
                    </>
                  )}
                </button>

                {/* Info Note */}
                <div className='mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100'>
                  <div className='flex items-start gap-2'>
                    <Lightbulb className='w-4 h-4 text-blue-500 mt-0.5' />
                    <p className='text-xs text-blue-700'>
                      Our AI generates up to 10 unique, SEO-optimized titles based on your keyword and selected category.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Results Display */}
          <div className='w-full'>
            <div className='bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col'>
              
              {/* Results Header */}
              <div className='bg-gradient-to-r from-purple-50 to-pink-50 p-5 border-b border-slate-100'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center'>
                      <TrendingUp className='w-5 h-5 text-white' />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold text-slate-800'>Generated Titles</h2>
                      <p className='text-xs text-slate-500'>AI-powered suggestions</p>
                    </div>
                  </div>
                  
                  {/* Copy Button */}
                  {content && (
                    <button
                      onClick={handleCopyAll}
                      className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all'
                    >
                      {copied ? (
                        <>
                          <Check className='w-4 h-4' />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className='w-4 h-4' />
                          <span>Copy All</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Results Body */}
              <div className='flex-1 p-6'>
                {!content ? (
                  <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
                    <div className='w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4'>
                      <Hash className='w-10 h-10 text-purple-500' />
                    </div>
                    <h3 className='text-md font-semibold text-slate-700 mb-2'>No titles generated yet</h3>
                    <p className='text-sm text-slate-400 max-w-xs'>
                      Enter a topic and click "Generate Titles" to get AI-powered blog title suggestions
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {/* Content Stats */}
                    <div className='flex items-center gap-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl'>
                      <div className='flex items-center gap-2'>
                        <Hash className='w-4 h-4 text-purple-500' />
                        <span className='text-xs text-slate-600'>
                          {content.split('\n').filter(line => line.trim().length > 0 && !line.includes('-')).length} titles generated
                        </span>
                      </div>
                      <div className='w-px h-4 bg-slate-200'></div>
                      <div className='flex items-center gap-2'>
                        <Sparkles className='w-4 h-4 text-purple-500' />
                        <span className='text-xs text-slate-600'>AI optimized</span>
                      </div>
                    </div>

                    {/* Markdown Content */}
                    <div className='prose prose-sm max-w-none'>
                      <div className='reset-tw bg-slate-50 rounded-xl p-5 border border-slate-100'>
                        <Markdown
                          components={{
                            h1: ({...props}) => <h1 className='text-xl font-bold text-slate-800 mt-4 mb-2 first:mt-0' {...props} />,
                            h2: ({...props}) => <h2 className='text-lg font-semibold text-slate-800 mt-3 mb-2' {...props} />,
                            h3: ({...props}) => <h3 className='text-base font-semibold text-slate-800 mt-2 mb-1' {...props} />,
                            p: ({...props}) => <p className='text-sm text-slate-600 mb-2 leading-relaxed' {...props} />,
                            ul: ({...props}) => <ul className='space-y-2 mb-3' {...props} />,
                            li: ({...props}) => <li className='text-sm text-slate-600 flex items-start gap-2' {...props} />,
                            strong: ({...props}) => <strong className='text-purple-600 font-semibold' {...props} />
                          }}
                        >
                          {content}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Footer (only when content exists) */}
              {content && (
                <div className='p-4 border-t border-slate-100 bg-slate-50'>
                  <p className='text-xs text-slate-500 text-center'>
                    💡 Tip: Click on any title to copy it individually
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogTitles