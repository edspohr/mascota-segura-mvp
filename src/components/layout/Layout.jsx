import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LogOut, Home, QrCode, ShieldAlert, Activity } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide header/footer on public emergency profile
  const isPublicProfile = location.pathname.startsWith('/p/');
  const isLanding = location.pathname === '/';

  if (isPublicProfile) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isLanding && user && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to={
                user.role === 'owner' ? '/dashboard' : 
                user.role === 'partner' ? '/partner' : 
                user.role === 'admin' ? '/admin' : 
                '/superadmin'
              } className="flex items-center gap-2 font-bold text-xl text-teal-600">
              <ShieldAlert className="w-6 h-6" />
              <span>Mascota Segura</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
              </div>
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {!isLanding && !isPublicProfile && (
        <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Mascota Segura. MVP Demo.
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
