import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { LogOut, User as UserIcon } from 'lucide-react';
import BottomNav from './BottomNav';
import Logo from '../ui/Logo';
import { DemoToolbar } from '../ui/DemoToolbar';
import { DemoBanner } from '../ui/DemoBanner';
import { DEMO_MODE } from '../../config/demo';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const isLanding = pathname === '/';
  const isPublicProfile = pathname.startsWith('/p/');
  const isOwner = user?.role === 'owner';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLanding || isPublicProfile) {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-teal-100 selection:text-[#008894]">
        {DEMO_MODE && <DemoBanner />}
        {children}
        {DEMO_MODE && <DemoToolbar />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 text-[#00457C] selection:bg-teal-100 selection:text-[#008894]">
      {DEMO_MODE && <DemoBanner />}
      
      {/* Header - Light & Premium */}
      <header className={`bg-white/70 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-40 shadow-sm ${isOwner ? 'hidden md:block' : ''}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link to={
                user?.role === 'owner' ? '/dashboard' : 
                user?.role === 'veterinary' ? '/veterinary' : 
                user?.role === 'partner' ? '/partner' : '/'
              } className="hover:opacity-80 transition-all active:scale-95">
              <Logo className="h-10" />
            </Link>

          <div className="flex items-center gap-6">
             {user && (
               <div className="flex items-center gap-4 group cursor-pointer">
                 <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-sm font-black text-[#00457C] tracking-tight">{user.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role === 'owner' ? 'Propietario' : 'Especialista'}</span>
                 </div>
                 <div className="relative">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-[1rem] object-cover border-2 border-white shadow-lg shadow-blue-900/10 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-10 h-10 rounded-[1rem] bg-slate-100 flex items-center justify-center text-slate-300">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#008894] border-2 border-white rounded-full shadow-sm" />
                 </div>
               </div>
             )}
             <div className="h-8 w-px bg-slate-100 hidden md:block" />
             <button 
               onClick={handleLogout} 
               className="p-3 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all active:scale-90"
               title="Cerrar Sesión"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {children}
      </main>

      {/* Bottom Nav for Owners on Mobile */}
      {isOwner && <BottomNav />}

      {/* Demo functionality */}
      {DEMO_MODE && <DemoToolbar />}
    </div>
  );
};

export default Layout;
