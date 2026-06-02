import React, { useState } from 'react';
import { assets } from "../assets/assets";
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  ChevronRight,
  Sparkles,
  Shield,
  Heart,
  Globe,
  MapPin,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubscribing(true);
    
    // Simulate API call - replace with actual newsletter subscription endpoint
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  const footerLinks = {
    product: {
      title: 'Product',
      links: [
        { name: 'AI Article Writer', href: '/ai/write-article' },
        { name: 'Image Generator', href: '/ai/generate-images' },
        { name: 'Background Remover', href: '/ai/remove-background' },
        { name: 'Resume Reviewer', href: '/ai/review-resume' },
        { name: 'Pricing', href: '/pricing' }
      ]
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Partners', href: '/partners' }
      ]
    },
    resources: {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'API Reference', href: '/api' },
        { name: 'Support Center', href: '/support' },
        { name: 'Status', href: '/status' },
        { name: 'Community', href: '/community' }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' },
        { name: 'Security', href: '/security' }
      ]
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/jdadai', color: 'hover:bg-[#1877f2]' },
    { icon: Twitter, href: 'https://twitter.com/jdadai', color: 'hover:bg-[#1da1f2]' },
    { icon: Instagram, href: 'https://instagram.com/jdadai', color: 'hover:bg-[#e4405f]' },
    { icon: Linkedin, href: 'https://linkedin.com/company/jdadai', color: 'hover:bg-[#0077b5]' },
    { icon: Github, href: 'https://github.com/jdadai', color: 'hover:bg-[#333]' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative px-6 md:px-16 lg:px-24 xl:px-32 pt-16 pb-8">
        
        {/* Top Section with Newsletter */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-gray-200"
        >
          
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <img className='w-10 h-10' src={assets.favicon} alt='logo' />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent'>
                Jdad AI
              </span>
              <div className="ml-2 px-2 py-0.5 bg-purple-100 rounded-full">
                <span className="text-xs font-semibold text-purple-600">AI Suite</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Transform your content creation with our suite of premium AI tools. 
              Write articles, generate images, and enhance your workflow with cutting-edge technology.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Shield className="w-3 h-3 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Globe className="w-3 h-3 text-blue-500" />
                <span>Global Access</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 transition-all duration-300 hover:text-white ${social.color} group`}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Links Sections */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {Object.values(footerLinks).map((section, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a 
                          href={link.href}
                          className="text-gray-500 text-sm hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group"
                        >
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Weekly Newsletter
              </h3>
              <p className="text-gray-500 text-xs mb-4">
                Get the latest AI trends, tips, and updates delivered to your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-12"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubscribing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  No spam, unsubscribe anytime.
                </p>
              </form>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-purple-200">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-3 h-3 text-purple-500" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3 h-3 text-purple-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-3 h-3 text-purple-500" />
                    <span>hello@jdadai.com</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-xs">
              © 2026 <a href="#" className="hover:text-purple-600 transition-colors">Totlesoft - Jdad AI</a>. 
              All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="/privacy" className="text-gray-400 hover:text-purple-600 transition-colors">Privacy</a>
            <span className="text-gray-300">•</span>
            <a href="/terms" className="text-gray-400 hover:text-purple-600 transition-colors">Terms</a>
            <span className="text-gray-300">•</span>
            <a href="/cookies" className="text-gray-400 hover:text-purple-600 transition-colors">Cookies</a>
            <span className="text-gray-300">•</span>
            <a href="/sitemap" className="text-gray-400 hover:text-purple-600 transition-colors">Sitemap</a>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-400" />
              <select className="text-xs bg-transparent text-gray-400 focus:outline-none cursor-pointer">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Floating Back to Top Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-300 z-50 group"
        >
          <ChevronRight className="w-5 h-5 rotate-[-90deg] group-hover:translate-y-[-2px] transition-transform" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;