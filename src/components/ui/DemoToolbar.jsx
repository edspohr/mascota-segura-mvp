import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { DEMO_MODE } from '../../config/demo';
import { DEV_LOGIN_ROLES } from '../../data/mockData';
import { isDemoUnlocked } from '../../hooks/useMockAuth';

const roleRoutes = {
  owner: '/dashboard',
  veterinary: '/veterinary',
  clinic_admin: '/veterinary',
  partner: '/partner',
  super_admin: '/dashboard',
};

export const DemoToolbar = () => {
  const { role, demoLoginAs, addToast } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Only show toolbar when demo is both enabled AND unlocked
  if (!DEMO_MODE || !isDemoUnlocked() || !role) return null;

  const current = DEV_LOGIN_ROLES.find(r => r.role === role);

  const switchTo = (newRole) => {
    demoLoginAs(newRole);
    addToast(`Cambiado a: ${newRole}`, 'info');
    navigate(roleRoutes[newRole]);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Role menu */}
      {open && (
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl w-64 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-2">
            Cambiar perfil demo
          </p>
          <div className="space-y-1">
            {DEV_LOGIN_ROLES.map(({ role: r, label, emoji }) => (
              <button
                key={r}
                onClick={() => switchTo(r)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all
                           ${r === role ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="text-xl">{emoji}</span>
                <span className={`text-sm font-bold ${r === role ? 'text-teal-600' : 'text-slate-700'}`}>{label}</span>
                {r === role && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle pill */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-white border border-slate-200 rounded-full
                   px-5 py-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all group"
      >
        <div className="relative">
          <span className="text-xl group-hover:scale-110 transition-transform inline-block">{current?.emoji}</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white animate-pulse" />
        </div>
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Demo Mode</p>
          <p className="text-sm font-bold text-slate-800 leading-tight">{current?.label}</p>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ml-1 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};
