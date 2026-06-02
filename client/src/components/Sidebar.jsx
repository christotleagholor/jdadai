import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users, Sparkles, Crown } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';

const navItems = [
  {label:'Dashboard',to:'/ai' ,Icon: House},
  {label:'Write Article',to:'/ai/write-article' ,Icon: SquarePen},
  {label:'Blog Titles',to:'/ai/blog-titles' ,Icon: Hash},
  {label:'Generate Images',to:'/ai/generate-images' ,Icon: Image},
  {label:'Remove Background',to:'/ai/remove-background' ,Icon: Eraser},
  {label:'Remove Object',to:'/ai/remove-object' ,Icon: Scissors},
  {label:'Review Resume',to:'/ai/review-resume' ,Icon: FileText},
  {label:'Community',to:'/ai/community' ,Icon: Users},
]

const Sidebar = ({sidebar,setSidebar}) => {

    const {user} = useUser();
    const {signOut, openUserProfile}= useClerk();
  return (
    <div className={`w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl flex flex-col justify-between items-center max-sm:fixed max-sm:top-0 max-sm:bottom-0 max-sm:z-50 ${sidebar?'translate-x-0':'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
        
        {/* Logo Section */}
        <div className="w-full pt-6 pb-4 px-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2 px-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Jdad AI
            </span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className='w-full px-4 pt-6 pb-4'>
            <div onClick={openUserProfile} className='flex flex-col items-center cursor-pointer group'>
              <div className="relative">
                <img src={user?.imageUrl} alt='' className='w-20 h-20 rounded-full ring-4 ring-purple-500/30 object-cover transition-all group-hover:ring-purple-500/50'/>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-slate-900"></div>
              </div>
              <h1 className='mt-3 font-semibold text-white'>{user?.fullName || 'User'}</h1>
              <div className="mt-1 px-3 py-1 bg-slate-700/50 rounded-full">
                <p className='text-xs text-slate-300 flex items-center gap-1'>
                  <Protect plan='premium' fallback='Free'>
                    <Crown className="w-3 h-3 text-yellow-500" />
                    Premium 
                  </Protect>
                  <Protect plan='premium' fallback='Free'>Plan</Protect>
                </p>
              </div>
            </div>
        </div>

        {/* Navigation Menu */}
        <div className='flex-1 w-full px-3 py-4'>
            <div className='space-y-1'>
              {navItems.map((item,index)=>(
                <NavLink 
                  key={index} 
                  to={item.to} 
                  end={item.to === '/ai'} 
                  onClick={()=>setSidebar(false)} 
                  className={({isActive}) => 
                    `px-3 py-2.5 flex items-center gap-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`
                  }
                >
                  {({isActive})=>(
                    <>
                      <item.Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-white' : 'group-hover:scale-110'}`}/>
                      <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
        </div>

        {/* Footer Section */}
        <div className='w-full border-t border-slate-700/50 p-4'>
          <div className='flex items-center justify-between gap-3'>
            <div onClick={openUserProfile} className='flex items-center gap-3 flex-1 cursor-pointer group'>
              <img src={user?.imageUrl} className='rounded-full w-10 h-10 ring-2 ring-slate-600 object-cover' alt=''/>
              <div className='flex-1 min-w-0'>
                <h1 className='text-sm font-medium text-white truncate'>{user?.fullName?.split(' ')[0] || 'User'}</h1>
                <p className='text-xs text-slate-400'>
                  <Protect plan='premium' fallback='Free'>Premium</Protect> Plan
                </p>
              </div>
            </div>
            <LogOut 
              onClick={signOut} 
              className='w-4.5 h-4.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer' 
            />
          </div>
        </div>
      
    </div>
  )
}

export default Sidebar