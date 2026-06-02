import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Zap, Crown, TrendingUp } from 'lucide-react';

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const testimonialData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop",
      name: "Michael Chen",
      title: "Content Director",
      company: "Digital Pulse Media",
      content: "Jdad AI has completely transformed our content strategy. We're producing 3x more articles without compromising quality. The blog title generator alone saves us hours of brainstorming every week.",
      rating: 5,
      role: "Enterprise Customer",
      metric: "300% increase in output",
      featured: true
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop",
      name: "Sarah Williams",
      title: "Marketing Manager",
      company: "GrowthLabs",
      content: "The AI image generation is mind-blowing. We've cut our design costs by 70% and can now create custom visuals for every blog post. Background removal is incredibly accurate.",
      rating: 5,
      role: "Premium User",
      metric: "70% cost reduction",
      featured: false
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
      name: "David Okonkwo",
      title: "Freelance Writer",
      company: "Self-Employed",
      content: "As a freelance writer, Jdad AI is my secret weapon. The article writer produces drafts that need minimal editing, and the resume reviewer helped me land my biggest client yet.",
      rating: 5,
      role: "Power User",
      metric: "2x faster writing",
      featured: false
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop",
      name: "Emily Rodriguez",
      title: "E-commerce Owner",
      company: "StyleHub",
      content: "Object removal and background editing have been game-changers for our product photos. We've saved thousands on photography editing and our conversion rates have improved.",
      rating: 4,
      role: "Business Owner",
      metric: "40% higher conversions",
      featured: false
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
      name: "James Thompson",
      title: "SEO Specialist",
      company: "RankBoost",
      content: "The article writer understands SEO naturally. Our blog traffic increased 150% in 3 months. This tool is worth every penny of the premium subscription.",
      rating: 5,
      role: "SEO Expert",
      metric: "150% traffic growth",
      featured: false
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop",
      name: "Lisa Park",
      title: "Creative Director",
      company: "Visionary Studios",
      content: "From concept to execution, Jdad AI streamlines our entire creative process. The image generation quality rivals professional designers at a fraction of the cost.",
      rating: 5,
      role: "Agency Partner",
      metric: "85% faster delivery",
      featured: false
    }
  ];

  const featuredTestimonial = testimonialData.find(t => t.featured);
  const otherTestimonials = testimonialData.filter(t => !t.featured);
  const itemsPerPage = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      const newCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      setVisibleCount(newCount);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % (otherTestimonials.length - visibleCount + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + (otherTestimonials.length - visibleCount + 1)) % (otherTestimonials.length - visibleCount + 1));
  };

  const visibleTestimonials = otherTestimonials.slice(currentIndex, currentIndex + visibleCount);

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="relative px-4 py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">Testimonials</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-4">
            Loved by Creators
          </h2>
          
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who've transformed their creative workflow with Jdad AI
          </p>
        </motion.div>

        {/* Featured Testimonial - Hero Card */}
        {featuredTestimonial && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative p-8 md:p-12 text-white">
                <Quote className="absolute top-8 right-8 w-16 h-16 text-white/10" />
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img 
                        src={featuredTestimonial.image} 
                        alt={featuredTestimonial.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <StarRating rating={featuredTestimonial.rating} />
                    <p className="text-xl md:text-2xl font-medium mt-4 mb-6 leading-relaxed">
                      "{featuredTestimonial.content}"
                    </p>
                    
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h4 className="font-bold text-lg">{featuredTestimonial.name}</h4>
                        <p className="text-purple-200 text-sm">
                          {featuredTestimonial.title} at {featuredTestimonial.company}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur rounded-full px-4 py-2">
                        <span className="text-sm font-semibold">{featuredTestimonial.metric}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Testimonials Grid/Carousel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">What our community says</h3>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => { setIsAutoPlaying(false); prevSlide(); }}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => { setIsAutoPlaying(false); nextSlide(); }}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 50 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleTestimonials.map((testimonial, idx) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <StarRating rating={testimonial.rating} />
                    
                    <p className="text-gray-600 text-sm mt-4 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    
                    <hr className="mb-5 border-gray-100" />
                    
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500">{testimonial.title}</p>
                        <p className="text-xs text-purple-600 mt-1">{testimonial.company}</p>
                      </div>
                    </div>
                    
                    {/* Metric Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span>{testimonial.metric}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(otherTestimonials.length - visibleCount + 1)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setIsAutoPlaying(false); setCurrentIndex(idx); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Social Proof Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {testimonialData.slice(0, 4).map((t, i) => (
                  <img key={i} src={t.image} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="" />
                ))}
              </div>
              <span className="text-white text-sm">Join 10,000+ creators</span>
            </div>
            <div className="text-white/60 text-sm">⭐ 4.9 average rating</div>
            <div className="text-white/60 text-sm">💬 2,500+ reviews</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonial;