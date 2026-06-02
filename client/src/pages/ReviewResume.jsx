import { FileText, Sparkles, Upload, Download, CheckCircle, XCircle, AlertCircle, TrendingUp, Award, Clock, FileCheck, Briefcase, GraduationCap, Star, Zap, Crown } from 'lucide-react';
import React, { useState, useRef, useContext } from 'react'
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { PremiumLimitContext } from '../limitContext/LimitContext';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const { limit, setPremiumLimit, isPremium, loading: contextLoading, checkFeatureAccess } = useContext(PremiumLimitContext);
  
  const [input, setInput] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [score, setScore] = useState(null);
  const fileInputRef = useRef(null);

  const { getToken } = useAuth();
  const { user } = useUser();

  // Check feature access
  const featureAccess = checkFeatureAccess?.('resume-review') || { 
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
      if (file.type === 'application/pdf') {
        handleFile(file);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setInput(file);
    setFileName(file.name);
    setContent('');
    setScore(null);
  };

  const handleClear = () => {
    setInput(null);
    setFileName('');
    setContent('');
    setScore(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extractScore = (reviewContent) => {
    const scoreMatch = reviewContent.match(/(\d+)(?:\/100|\%)/);
    if (scoreMatch) {
      return parseInt(scoreMatch[1]);
    }
    return null;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input) {
      toast.error('Please upload your resume');
      return;
    }
    
    // Check if user has access
    if (!hasAccess) {
      if (!isPremium) {
        toast.error('Resume review is a premium feature. Upgrade to Pro to get your resume analyzed.');
      } else {
        toast.error('You have reached your monthly limit. Upgrade or wait for next month.');
      }
      return;
    }
    
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        }
      })
      
      if (data.success) {
        setContent(data.content);
        const extractedScore = extractScore(data.content);
        setScore(extractedScore);
        toast.success('Resume analyzed successfully!');
        
        // Only increment usage for non-premium users
        if (!isPremium && setPremiumLimit) {
          await setPremiumLimit();
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Review error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to analyze resume')
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized for ATS systems.';
    if (score >= 60) return 'Good progress! Your resume has potential but needs some improvements.';
    return 'Needs improvement. Follow the recommendations below to enhance your resume.';
  };

  // Show loading state while checking subscription
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">AI Career Assistant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Resume Review
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> & Analysis</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Get professional AI-powered feedback to improve your resume and land your dream job
          </p>
          
          {/* Plan Badge */}
          <div className="flex justify-center mt-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isPremium 
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isPremium ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-yellow-500" />
                  Pro Plan - Unlimited Resume Reviews
                </>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5 text-gray-500" />
                  Free Plan - {creditsLeft} review{creditsLeft !== 1 ? 's' : ''} remaining
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Upload Resume</h2>
                  <p className="text-sm text-blue-100">PDF format only</p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="p-6">
              
              {/* Upload Area */}
              {!input ? (
                <div
                  onClick={() => !isPremium || creditsLeft > 0 ? fileInputRef.current?.click() : null}
                  onDragEnter={!isPremium || creditsLeft > 0 ? handleDrag : null}
                  onDragLeave={!isPremium || creditsLeft > 0 ? handleDrag : null}
                  onDragOver={!isPremium || creditsLeft > 0 ? handleDrag : null}
                  onDrop={!isPremium || creditsLeft > 0 ? handleDrop : null}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                    (!isPremium && !isCreditsRemaining)
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : dragActive 
                        ? 'border-blue-500 bg-blue-50 cursor-pointer' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">
                        {(!isPremium && !isCreditsRemaining) 
                          ? 'No reviews remaining' 
                          : 'Drag & drop your resume here'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {(!isPremium && !isCreditsRemaining) 
                          ? 'Upgrade to Pro for unlimited reviews' 
                          : 'or click to browse'}
                      </p>
                    </div>
                    {(!isPremium && !isCreditsRemaining) ? (
                      <button
                        type="button"
                        onClick={() => window.location.href = '/pricing'}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm hover:shadow-lg transition-all"
                      >
                        Upgrade to Pro
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Select PDF
                      </button>
                    )}
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange} 
                    accept="application/pdf" 
                    className="hidden" 
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{fileName}</p>
                      <p className="text-xs text-gray-500">Ready for analysis</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <button 
                    disabled={loading || (!isPremium && !isCreditsRemaining)} 
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                      loading || (!isPremium && !isCreditsRemaining)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Analyzing Resume...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Review Resume</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Premium Upgrade Notice for non-premium */}
              {!isPremium && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-start gap-2">
                    <Crown className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-purple-700 font-medium">Premium Feature</p>
                      <p className="text-xs text-purple-600 mt-0.5">
                        Resume review is a premium feature. Upgrade to Pro for unlimited resume analyses!
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
                </div>
              )}

              {/* Credit Warning for non-premium with no credits */}
              {!isPremium && !isCreditsRemaining && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-600">
                      You've used all your free resume reviews. Upgrade to premium for unlimited reviews.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Your resume is analyzed securely. Our AI checks for ATS compatibility, formatting, keywords, and content quality.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Results Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
                    <p className="text-sm text-gray-400">AI-powered resume feedback</p>
                  </div>
                </div>
                {score && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{score}<span className="text-sm">/100</span></div>
                    <p className="text-xs text-gray-400">Overall Score</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 max-h-[600px] overflow-y-auto">
              {!content ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No analysis yet</h3>
                  <p className="text-gray-400 text-sm max-w-sm">
                    Upload your resume (PDF format) and click "Review Resume" to get detailed feedback
                  </p>
                  {!isPremium && (
                    <p className="text-xs text-gray-400 mt-3">
                      Free users have {3 - (limit || 0)} review{3 - (limit || 0) !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Score Overview */}
                  {score && (
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Resume Score
                        </h3>
                        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {getScoreMessage(score)}
                      </p>
                    </div>
                  )}

                  {/* Detailed Review Content */}
                  <div className="prose prose-sm max-w-none">
                    <div className="reset-tw text-gray-700 leading-relaxed">
                      <Markdown
                        components={{
                          h1: ({...props}) => <h1 className="text-xl font-bold text-gray-800 mt-4 mb-3 pb-2 border-b border-gray-200" {...props} />,
                          h2: ({...props}) => <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2 flex items-center gap-2" {...props} />,
                          h3: ({...props}) => <h3 className="text-base font-semibold text-gray-800 mt-3 mb-2" {...props} />,
                          p: ({...props}) => <p className="text-sm text-gray-600 mb-3 leading-relaxed" {...props} />,
                          ul: ({...props}) => <ul className="space-y-2 mb-4 list-disc pl-5" {...props} />,
                          li: ({...props}) => <li className="text-sm text-gray-600" {...props} />,
                          strong: ({...props}) => <strong className="font-semibold text-gray-800" {...props} />,
                          blockquote: ({...props}) => <blockquote className="border-l-4 border-blue-400 pl-4 py-2 my-3 text-sm text-gray-600 bg-blue-50 rounded-r-lg" {...props} />
                        }}
                      >
                        {content}
                      </Markdown>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const blob = new Blob([content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `resume-review-${Date.now()}.md`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success('Report saved!');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save Report</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">ATS Check</p>
                <p className="text-xs text-gray-500">Applicant tracking system</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Keyword Analysis</p>
                <p className="text-xs text-gray-500">Industry-specific terms</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Formatting Review</p>
                <p className="text-xs text-gray-500">Structure & layout</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Actionable Tips</p>
                <p className="text-xs text-gray-500">Improvement suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewResume