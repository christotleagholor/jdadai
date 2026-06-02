import React, { useEffect, useState } from 'react'
import { Gem, Sparkles, TrendingUp, Calendar, Layers, Zap, ChevronRight, Clock } from 'lucide-react';
import CreationItem from '../components/CreationItem';
import { Protect, useAuth } from '@clerk/clerk-react';
import axios from 'axios'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {

  const [creations,setCreations] = useState([]);
  const [loading,setLoading] = useState(true)
  const {getToken} =useAuth();

  const getDashboardData = async () => {
    try {
      const {data} = await axios.get("/api/user/get-user-creations",{
        headers:{
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if(data.success){
        setCreations(data.creations);
        console.log(data.creations);
        
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
    
  useEffect(()=>{
    getDashboardData();
  },[]);

  // Calculate stats
  const totalCreations = creations.length;
  const thisMonthCreations = creations.filter(item => {
    const date = new Date(item.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50'>
      <div className='h-full overflow-y-auto p-6 lg:p-8'>
        
        {/* Welcome Header */}
        <div className='mb-8'>
          <h1 className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
            Dashboard
          </h1>
          <p className='text-slate-500 text-sm mt-1'>Track your AI creations and monitor your progress</p>
        </div>

        {/* Demo Credit Notice */}
        <div className='mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl'>
          <div className='flex items-start gap-3'>
            <Zap className='w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5' />
            <p className='text-amber-700 text-sm'>
              You have a maximum of 3 credits to explore premium features such as image generation, 
              background removal, and object removal. These limitations are in place because the 
              demo relies on free-tier APIs.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
          
          {/* Total creation card */}
          <div className='group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100'>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl"></div>
            <div className='relative p-5'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-slate-500 text-sm mb-1'>Total Creations</p>
                  <h2 className='text-3xl font-bold text-slate-800'>{totalCreations}</h2>
                </div>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <Layers className='w-6 h-6 text-white'/>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Total content pieces</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Creations Card */}
          <div className='group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100'>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
            <div className='relative p-5'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-slate-500 text-sm mb-1'>This Month</p>
                  <h2 className='text-3xl font-bold text-slate-800'>{thisMonthCreations}</h2>
                </div>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <Calendar className='w-6 h-6 text-white'/>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Created in {new Date().toLocaleString('default', { month: 'long' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active plan card */}
          <div className='group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100'>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-2xl"></div>
            <div className='relative p-5'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-slate-500 text-sm mb-1'>Active Plan</p>
                  <h2 className='text-2xl font-bold text-slate-800 flex items-center gap-2'>
                    <Protect plan='premium' fallback='Free'>
                      <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Premium</span>
                    </Protect>
                  </h2>
                </div>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <Gem className='w-6 h-6 text-white'/>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unlock all premium features</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Rate Card */}
          <div className='group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className='relative p-5'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-emerald-100 text-sm mb-1'>Success Rate</p>
                  <h2 className='text-3xl font-bold text-white'>98%</h2>
                </div>
                <div className='w-12 h-12 rounded-xl bg-white/20 backdrop-blur shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <TrendingUp className='w-6 h-6 text-white'/>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20">
                <div className="flex items-center gap-2 text-xs text-emerald-100">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Creations Section */}
        <div className='mt-8'>
          <div className='flex items-center justify-between mb-5'>
            <div>
              <p className='text-lg font-semibold text-slate-800'>Recent Creations</p>
              <p className='text-slate-500 text-sm'>Your latest AI-generated content</p>
            </div>
            {creations.length > 0 && (
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {
            loading ? (
              <div className='flex items-center justify-center py-20'>
                <div className="relative">
                  <div className='w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin'></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : creations.length > 0 ? (
              <div className='space-y-3'>
                {creations.slice(0, 5).map((item)=>(
                  <CreationItem key={item._id} item={item}/>
                ))}
              </div>
            ) : (
              <div className='text-center py-16 bg-white rounded-2xl border border-slate-100'>
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No creations yet</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Start creating amazing content with our AI tools
                </p>
                <button 
                  onClick={() => window.location.href = '/ai/write-article'}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Create Your First Content
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard