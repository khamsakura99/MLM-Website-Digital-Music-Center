import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useMlm } from '../context/MlmContext';

export const Toasts: React.FC = () => {
  const { toasts } = useMlm();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg text-xs flex items-center gap-2.5 transition-all transform animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/50'
              : toast.type === 'error'
              ? 'bg-red-950 text-red-100 border-red-500/50'
              : 'bg-slate-900 text-white border-blue-500/50'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span className="font-medium leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
