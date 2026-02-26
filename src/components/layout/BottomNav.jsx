import React from 'react';
import { Home, PawPrint, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { to: "/dashboard", label: "Inicio", icon: <Home className="w-6 h-6" /> },
    { to: "/my-pets", label: "Mascotas", icon: <PawPrint className="w-6 h-6" /> },
    { to: "/profile", label: "Perfil", icon: <User className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 shadow-lg md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-teal-400' : 'text-zinc-500 hover:text-zinc-300'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
