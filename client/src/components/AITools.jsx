import React, { useState } from 'react';
import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Crown, Zap, ChevronRight, Star, TrendingUp, Wand2 } from 'lucide-react';

const AITools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTool, setHoveredTool] = useState(null);

  // Define which tools are premium (based on your business logic)
  const premiumTools = ['AI Image Generation', 'Background Removal', 'Object Removal'];
  const freeTools = ['AI Article Writer', 'Blog Title Generator', 'Resume Reviewer'];

  const toolsWithTier = AiToolsData.map(tool => ({
    ...tool,
    tier: premiumTools.includes(tool.title) ? 'premium' : 'free'
  }));

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Tools', icon: Zap, count: toolsWithTier.length },
    { id: 'free', name: 'Free', icon: Sparkles, count: toolsWithTier.filter(t => t.tier === 'free').length },
    { id: 'premium', name: 'Premium', icon: Crown, count: toolsWithTier.filter(t => t.tier === 'premium').length }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? toolsWithTier 
    : toolsWithTier.filter(tool => tool.tier === selectedCategory);

  const handleToolClick = (tool) => {
    if (user) {
      navigate(tool.path);
    } else {
      openSignIn();
    }
  };

  // Get icon component by name for features
  const getFeatureIcon = (toolTitle) => {
    if (toolTitle.includes('Article') || toolTitle.includes('Blog')) {
      return <TrendingUp className="w-3 h-3" />;
    }
    if (toolTitle.includes('Image') || toolTitle.includes('Background') || toolTitle.includes('Object')) {
      return <Wand2 className="w-3 h-3" />;
    }
    if (toolTitle.includes('Resume')) {
      return <Star className="w-3 h-3" />;
    }
    return <Sparkles className="w-3 h-3" />;
  };

  // Get feature tags based on tool type
  const getToolFeatures = (toolTitle) => {
    if (toolTitle.includes('Article')) {
      return ['SEO Optimized', 'Multi-language'];
    }
    if (toolTitle.includes('Blog')) {
      return ['Clickbaity', 'Professional'];
    }
    if (toolTitle.includes('Image')) {
      return ['4K Quality', 'Multiple Styles'];
    }
    if (toolTitle.includes('Background')) {
      return ['Instant', 'Transparent PNG'];
    }
    if (toolTitle.includes('Object')) {
      return ['Seamless', 'AI Powered'];
    }
    if (toolTitle.includes('Resume')) {
      return ['ATS Friendly', 'Expert Tips'];
    }
    return ['AI-Powered', 'Instant Results'];
  };

  return (
    <div className="relative px-4 py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-100 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section - Mobile App Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 px-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">AI Suite</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-4">
            Powerful AI Tools
          </h2>
          
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to create, enhance and optimize your content with cutting-edge AI technology
          </p>
        </motion.div>

        {/* Category Filter - Horizontal Scroll on Mobile */}
        <div className="mb-12 overflow-x-auto hide-scrollbar px-4">
          <div className="flex gap-3 justify-center min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm">{category.name}</span>
                  {category.count && (
                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      ({category.count})
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid - Mobile App Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <AnimatePresence>
            {filteredTools.map((tool, index) => {
              const isPremium = tool.tier === 'premium';
              const isHovered = hoveredTool === index;
              const features = getToolFeatures(tool.title);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredTool(index)}
                  onMouseLeave={() => setHoveredTool(null)}
                  onClick={() => handleToolClick(tool)}
                  className="group relative cursor-pointer"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    
                    {/* Premium Badge */}
                    {isPremium && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className={`${!user ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-purple-500 to-pink-500'} rounded-full px-3 py-1 flex items-center gap-1 shadow-lg`}>
                          {!user ? (
                            <>
                              <Lock className="w-3 h-3 text-white" />
                              <span className="text-white text-xs font-semibold">Premium</span>
                            </>
                          ) : (
                            <>
                              <Crown className="w-3 h-3 text-yellow-300" />
                              <span className="text-white text-xs font-semibold">Pro</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Free Badge */}
                    {!isPremium && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                          <Sparkles className="w-3 h-3 text-white" />
                          <span className="text-white text-xs font-semibold">Free</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Icon Container */}
                    <div className="relative mb-6">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})` }}
                      >
                        <tool.Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Animated Ring */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110 group-hover:scale-100"></div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                      {tool.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {tool.description}
                    </p>
                    
                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {getFeatureIcon(tool.title)}
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* CTA Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                        {user ? 'Launch Tool' : isPremium ? 'Upgrade to Access' : 'Try for Free'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    {/* Hover Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Premium CTA - Only for non-authenticated users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center px-4"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Unlock Premium Features</h3>
              <p className="text-purple-100 mb-6 max-w-md mx-auto">
                Get access to AI image generation, background removal, and advanced editing tools
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                View Plans
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Custom Scrollbar Hide CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AITools;