import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState, useRef } from 'react'
import { Heart, Sparkles, Users, TrendingUp, Search, Filter, Grid3x3, LayoutGrid, MessageCircle, Share2, Bookmark, Eye, Clock, ChevronDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {

  const [creations, setCreations] = useState([]);
  const [filteredCreations, setFilteredCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, most-liked, recent
  const [viewMode, setViewMode] = useState('grid'); // grid, masonry
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();
  const modalRef = useRef(null);

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {
        setCreations(data.creations);
        setFilteredCreations(data.creations);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post("/api/user/toggle-like-creation", { id }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {
        await fetchCreations();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...creations];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(creation => 
        creation.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort filter
    if (filterType === 'most-liked') {
      filtered.sort((a, b) => b.likes.length - a.likes.length);
    } else if (filterType === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredCreations(filtered);
  }, [searchTerm, filterType, creations]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    totalImages: creations.length,
    totalLikes: creations.reduce((sum, c) => sum + c.likes.length, 0),
    totalCreators: new Set(creations.map(c => c.userId)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading community gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-5">
              <Users className="w-4 h-4" />
              <span className="text-sm">Community Gallery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore AI Creations
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Discover amazing artwork created by our community. Get inspired and share your own creations.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-2xl mx-auto">
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur">
              <div className="text-2xl font-bold">{stats.totalImages}</div>
              <div className="text-xs text-blue-200">AI Images</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur">
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
              <div className="text-xs text-blue-200">Total Likes</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur">
              <div className="text-2xl font-bold">{stats.totalCreators}</div>
              <div className="text-xs text-blue-200">Creators</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="all">All Images</option>
                  <option value="most-liked">Most Liked</option>
                  <option value="recent">Most Recent</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 px-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 px-3 transition-colors ${viewMode === 'masonry' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-semibold text-gray-700">{filteredCreations.length}</span> of {creations.length} creations
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredCreations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No creations found</h3>
            <p className="text-gray-400 text-sm">
              {searchTerm ? 'Try a different search term' : 'Be the first to share an AI creation!'}
            </p>
          </div>
        ) : (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
          }`}>
            {filteredCreations.map((creation, index) => (
              <div
                key={creation._id || index}
                onClick={() => setSelectedImage(creation)}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={creation.content} 
                    alt={creation.prompt || 'AI Generated'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Prompt */}
                    <p className="text-white text-sm line-clamp-2 mb-3">
                      {creation.prompt || 'No description'}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            imageLikeToggle(creation._id);
                          }}
                          className="flex items-center gap-1.5 text-white hover:text-red-400 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${creation.likes.includes(user?.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-xs">{creation.likes.length}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-white/70">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-xs">123</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/70 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(creation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Badge */}
                {creation.likes.length > 10 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    🔥 Trending
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredCreations.length >= 12 && (
          <div className="text-center mt-10">
            <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            ref={modalRef}
            className="max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selectedImage.content} 
                alt={selectedImage.prompt}
                className="w-full h-auto max-h-[70vh] object-contain bg-gray-900"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => imageLikeToggle(selectedImage._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${selectedImage.likes.includes(user?.id) ? 'fill-red-500' : ''}`} />
                    <span>{selectedImage.likes.length} Likes</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Prompt:</span> {selectedImage.prompt || 'No description provided'}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>Created {formatDate(selectedImage.createdAt)}</span>
                  <span>•</span>
                  <span>ID: {selectedImage._id?.slice(-8)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Community