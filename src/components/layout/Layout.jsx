import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/Context';
import { LogOut, ShieldAlert } from 'lucide-react';
import BottomNav from './BottomNav';

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
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Header - Hidden on mobile for owners to save space, or kept simple */}
      <header className={`bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm ${isOwner ? 'hidden md:block' : ''}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to={
                user?.role === 'owner' ? '/dashboard' : 
                user?.role === 'partner' ? '/partner' : 
                user?.role === 'partner_admin' ? '/partner' :
                user?.role === 'admin' ? '/admin' : 
                user?.role === 'superadmin' ? '/superadmin' :
                '/'
              } className="flex items-center gap-2 font-bold text-xl text-teal-600">
              <ShieldAlert className="w-6 h-6" />
              <span>Mascota Segura</span>
            </Link>

          <div className="flex items-center gap-4">
             {user && (
               <div className="flex items-center gap-2">
                 <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
                 <span className="hidden md:inline text-sm font-medium text-slate-700">{user.name}</span>
               </div>
             )}
             <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
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
