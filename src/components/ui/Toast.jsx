import React, { useState, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastContext } from '../../context/ToastContext';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  const addToast = (message, type = 'info') => {
    const id = idCounter.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-full duration-300
              ${toast.type === 'success' ? 'bg-white border-green-100 text-green-700' : ''}
              ${toast.type === 'error' ? 'bg-white border-red-100 text-red-700' : ''}
              ${toast.type === 'info' ? 'bg-slate-800 text-white border-slate-700' : ''}
            `}
          >
             {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
             {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
             {toast.type === 'info' && <Info className="w-5 h-5 text-slate-400" />}
             <span className="font-medium text-sm">{toast.message}</span>
             <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70">
               <X className="w-4 h-4" />
             </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
