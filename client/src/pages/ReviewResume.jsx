import { FileText, Sparkles, Upload, Download, CheckCircle, XCircle, AlertCircle, TrendingUp, Award, Clock, FileCheck, Briefcase, GraduationCap, Star, Zap } from 'lucide-react';
import React, { useState, useRef } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const [input, setInput] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [score, setScore] = useState(null);
  const fileInputRef = useRef(null);

  const { getToken } = useAuth();

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
    // Try to extract a score from the review (e.g., "Score: 85/100" or "85%")
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
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

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
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Drag & drop your resume here</p>
                      <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Select PDF
                    </button>
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
                    disabled={loading} 
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                      loading
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
                        {score >= 80 ? 'Excellent! Your resume is well-optimized.' : 
                         score >= 60 ? 'Good progress! Some improvements needed.' : 
                         'Needs improvement. Follow the recommendations below.'}
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
                      onClick={() => window.print()}
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