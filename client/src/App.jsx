import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import { Route, Routes, useLocation } from 'react-router-dom';
import TargetCursor from './components/TargetCursor';
import Credits from './pages/Credits';
import Login from './pages/Login';
import Loading from './pages/Loading';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Models from './pages/Models';
import { assets } from './assets/assets';
import './assets/prism.css';
import { useAppContext } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

const App = () => {

  const { user, loadingUser, theme, themeColor } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadingUser) return <Loading />

  // Dynamic Mood Styles - Premium Lovable/Claude Palette
  const getBackgroundGradient = () => {
    const isDark = theme === 'dark';
    
    const gradients = {
      violet: isDark 
        ? "from-purple-900/40 via-slate-900 to-rose-900/30" 
        : "from-purple-100 via-white to-rose-50/50",
      emerald: isDark 
        ? "from-emerald-900/40 via-slate-950 to-teal-900/20" 
        : "from-emerald-50 via-white to-teal-50/50",
      ocean: isDark 
        ? "from-blue-900/40 via-slate-950 to-indigo-900/20" 
        : "from-blue-50 via-white to-indigo-50/50",
      rose: isDark 
        ? "from-rose-900/40 via-slate-950 to-pink-900/20" 
        : "from-rose-50 via-white to-pink-50/50",
      amber: isDark 
        ? "from-amber-900/30 via-slate-950 to-orange-900/20" 
        : "from-amber-50 via-white to-orange-50/50"
    };

    const gradient = gradients[themeColor] || gradients.violet;
    const baseBg = isDark ? "bg-[#0f172a]" : "bg-[#fafafa]";
    const textColor = isDark ? "text-slate-100 font-medium" : "text-slate-900";

    return `transition-colors duration-700 ${baseBg} ${textColor} bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_50%),_radial-gradient(circle_at_bottom_left,_var(--tw-gradient-to),_transparent_50%)] ${gradient}`;
  };

  return (
    <>
      <TargetCursor />
      <Toaster />

      {!isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-6 left-6 p-2 rounded-xl h-10 w-10 flex items-center justify-center liquid-glass md:hidden cursor-pointer z-50 hover:scale-110 transition-transform"
        >
          <img
            src={assets.menu_icon}
            className="w-5 invert dark:invert-0"
            alt="menu"
          />
        </div>
      )}

      <div className={`h-screen w-screen overflow-hidden transition-all duration-1000 relative ${getBackgroundGradient()}`}>
        {/* Advanced Aura Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 transition-all duration-1000">
          <div className={`absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br blur-[120px] animate-pulse transition-all duration-1000
            ${themeColor === 'emerald' ? 'from-emerald-400/30 shadow-[0_0_100px_rgba(16,185,129,0.2)]' : 
              themeColor === 'ocean' ? 'from-blue-400/30 shadow-[0_0_100px_rgba(59,130,246,0.2)]' :
              themeColor === 'rose' ? 'from-rose-400/30 shadow-[0_0_100px_rgba(244,63,94,0.2)]' :
              themeColor === 'amber' ? 'from-amber-400/30 shadow-[0_0_100px_rgba(245,158,11,0.2)]' :
              'from-purple-400/30 shadow-[0_0_100px_rgba(139,92,246,0.2)]'}`}></div>
          
          <div className={`absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br blur-[100px] animate-pulse delay-700 transition-all duration-1000
            ${themeColor === 'emerald' ? 'from-teal-400/20' : 
              themeColor === 'ocean' ? 'from-sky-400/20' :
              themeColor === 'rose' ? 'from-pink-400/20' :
              themeColor === 'amber' ? 'from-orange-400/20' :
              'from-blue-400/20'}`}></div>
          
          <div className={`absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-br blur-[110px] animate-pulse delay-1000 transition-all duration-1000
            ${themeColor === 'emerald' ? 'from-lime-400/20' : 
              themeColor === 'ocean' ? 'from-cyan-400/20' :
              themeColor === 'rose' ? 'from-red-400/20' :
              themeColor === 'amber' ? 'from-yellow-400/20' :
              'from-pink-400/20'}`}></div>
        </div>

        <div className="flex h-full w-full relative z-10">
          {user && <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          <div className="flex-1 overflow-hidden">
            <Routes>
              {user ? (
                <>
                  <Route path="/" element={<ChatBox />} />
                  <Route path="/credits" element={<Credits />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/models" element={<Models />} />
                </>
              ) : (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Login />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
