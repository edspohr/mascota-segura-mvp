import React from 'react';
import { Home, PawPrint, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { to: "/dashboard", label: "Inicio", icon: <Home className="w-5 h-5" /> },
    { to: "/my-pets", label: "Mascotas", icon: <PawPrint className="w-5 h-5" /> },
    { to: "/profile", label: "Perfil", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,69,124,0.06)] md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group ${
                isActive ? 'text-[#008894]' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isActive ? 'bg-teal-50 shadow-sm' : 'group-active:scale-90 hover:bg-slate-50'}`}>
                    {item.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60'}`}>
                    {item.label}
                </span>
                {isActive && (
                    <div className="absolute -top-[1.5px] w-8 h-[3px] bg-[#008894] rounded-full shadow-[0_0_8px_rgba(0,136,148,0.3)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
