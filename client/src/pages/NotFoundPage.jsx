import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Compass, 
  Sparkles,
  AlertCircle,
  Zap,
  Globe
} from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const suggestions = [
    { name: 'Go to Dashboard', path: '/ai', icon: Home },
    { name: 'Generate Article', path: '/ai/write-article', icon: Sparkles },
    { name: 'Create Image', path: '/ai/generate-images', icon: Zap },
    { name: 'View Pricing', path: '/pricing', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.8 }}
            className="relative mb-8"
          >
            <div className="relative inline-block">
              <div className="text-8xl sm:text-9xl md:text-[12rem] font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                404
              </div>
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 animate-bounce">
                <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500" />
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to another dimension.
            </p>
          </motion.div>

          {/* Search/Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 max-w-md mx-auto border border-white/10">
              <div className="flex items-center gap-2 text-gray-300 mb-3">
                <Search className="w-5 h-5" />
                <span className="text-sm font-medium">Need help finding something?</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for features, tools, or guides..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Quick Navigation Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-gray-300 text-sm mb-4 flex items-center justify-center gap-2">
              <Compass className="w-4 h-4" />
              Here are some helpful links:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </motion.div>

          {/* Fun Fact / Easter Egg */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-xs">
              Did you know? The number 404 appears in error pages because it's the HTTP status code for "Not Found".
              <br />© 2024 Jdad AI - Creating amazing content with AI
            </p>
          </motion.div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;