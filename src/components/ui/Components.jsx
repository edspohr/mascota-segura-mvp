import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary:   'bg-[#008894] text-white hover:bg-teal-700 shadow-md shadow-teal-900/10',
    secondary: 'bg-white text-[#00457C] border border-slate-200 hover:bg-slate-50 shadow-sm',
    danger:    'bg-[#00457C] text-white hover:bg-slate-800', // Still Navy for serious but safe feel
    warning:   'bg-amber-400 text-[#00457C] hover:bg-amber-500 font-bold', 
    outline:   'bg-transparent text-[#008894] border-2 border-[#008894] hover:bg-teal-50',
    ghost:     'bg-transparent text-slate-500 hover:text-[#00457C] hover:bg-slate-50',
  };

  return (
    <button
      className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-bold text-[#00457C] ml-1 opacity-80 uppercase tracking-wider">{label}</label>}
      <input
        className={`px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-[#00457C] focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-[#008894] transition-all placeholder:text-slate-300 shadow-sm ${error ? 'border-amber-400 ring-amber-400/10' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-bold text-amber-600 ml-1">{error}</span>}
    </div>
  );
};

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00457C]/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-2xl text-[#00457C] tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-300 hover:text-[#00457C] hover:bg-slate-50 rounded-full transition-all">
            <span className="text-2xl leading-none">✕</span>
          </button>
        </div>
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};
