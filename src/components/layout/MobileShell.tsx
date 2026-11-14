'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Battery, Signal, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-0 md:p-6 lg:p-8">
      {/* Container simulating mobile device on desktop while perfectly full-width on mobile */}
      <div className="w-full max-w-[430px] min-h-screen md:min-h-[890px] md:max-h-[920px] bg-slate-50 flex flex-col relative md:rounded-[44px] shadow-2xl md:border-[10px] md:border-slate-800/90 overflow-hidden select-none">
        
        {/* iOS-style Status Bar (Visual Mobile Touch) */}
        <div className="w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 z-50 bg-transparent shrink-0">
          <span>9:41</span>
          {/* Dynamic Island / Speaker Pill on Desktop */}
          <div className="hidden md:block w-24 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Main App Content Viewport */}
        <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {/* Global Toast Notifications inside Mobile Viewport */}
        <div className="absolute top-12 left-4 right-4 z-50 pointer-events-none flex flex-col space-y-2">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-lg border backdrop-blur-md text-sm font-medium ${
                  toast.type === 'success'
                    ? 'bg-emerald-900/95 text-white border-emerald-500/30'
                    : toast.type === 'error'
                    ? 'bg-rose-900/95 text-white border-rose-500/30'
                    : 'bg-slate-900/95 text-white border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5 flex-1 pr-2">
                  {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
                  <span className="text-xs leading-snug">{toast.message}</span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Subtle Desktop Info Pill */}
      <div className="hidden md:flex items-center space-x-3 mt-3 text-xs text-slate-400 font-medium">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mobile-First Simulator (375px–430px target)</span>
        </span>
        <span>•</span>
        <span>Track-Amount Fintech OS</span>
      </div>
    </div>
  );
};

