import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { LogOut } from 'lucide-react';
import BottomNav from './BottomNav';
import Logo from '../ui/Logo';

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
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 text-slate-900">
      {/* Header - Light & Professional */}
      <header className={`bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-sm ${isOwner ? 'hidden md:block' : ''}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to={
                user?.role === 'owner' ? '/dashboard' : 
                user?.role === 'veterinary' ? '/veterinary' : 
                user?.role === 'partner' ? '/partner' : '/'
              } className="hover:opacity-90 transition-opacity">
              <Logo className="h-10" />
            </Link>

          <div className="flex items-center gap-4">
             {user && (
               <div className="flex items-center gap-3">
                 <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-100 bg-slate-50" />
                 <span className="hidden md:inline text-sm font-semibold text-slate-700">{user.name}</span>
               </div>
             )}
             <button 
               onClick={handleLogout} 
               className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
               title="Cerrar Sesión"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Bottom Nav for Owners on Mobile */}
      {isOwner && <BottomNav />}
    </div>
  );
};

export default Layout;
