import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { Sparkles, Play, ArrowRight, Zap, Shield, Star } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Auto-play prevented:', e));
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        {/* Mobile App Style Status Bar */}
        <div className="w-full max-w-md mx-auto mb-8 flex justify-between items-center text-white/60 text-xs">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 inline-flex items-center gap-2 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">AI-Powered Platform</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-[1.1]">
            Create Amazing
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Content with AI
            </span>
          </h1>
          
          <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Transform your creative process with our premium AI suite. Generate articles, create stunning images, and boost productivity instantly.
          </p>
        </motion.div>

        {/* CTA Buttons - Mobile App Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto mb-12"
        >
          <button
            onClick={() => navigate('/ai')}
            className="group relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              Start Creating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>

        {/* Social Proof - Mobile App Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/10">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-white">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.9</span>
                <span className="text-white/60">rating</span>
              </div>
              <p className="text-sm text-white/60">Trusted by 10,000+ creators</p>
            </div>
          </div>
        </motion.div>

        {/* Feature Pills - Mobile App Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 max-w-md mx-auto"
        >
          {[
            { icon: Zap, text: "Lightning Fast" },
            { icon: Shield, text: "Secure & Private" },
            { icon: Sparkles, text: "Premium Quality" }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10"
            >
              <feature.icon className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom Navigation Indicator (Mobile Style) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;