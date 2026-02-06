import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const t: Toast = { id, type, message };
    setToasts(prev => [t, ...prev]);
    // Auto remove after 4s
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(x => x.id !== id));

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-2 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm text-sm flex items-center justify-between ${
              t.type === 'success' ? 'bg-emerald-600/90 text-white' : t.type === 'error' ? 'bg-rose-600/95 text-white' : 'bg-gray-800 text-white'
            }`}
          >
            <div className="flex-1 pr-3">{t.message}</div>
            <button onClick={() => removeToast(t.id)} className="ml-2 opacity-90 hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
