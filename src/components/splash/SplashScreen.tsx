'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Wallet, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentView, currentUser } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        if (currentUser) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('login');
        }
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, currentUser, setCurrentView]);

  const handleSkip = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center p-8 bg-gradient-to-b from-indigo-950 via-brand-900 to-indigo-950 text-white overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top micro pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-4 flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium text-brand-200 border border-white/15"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Fintech Grade Security & Insights</span>
      </motion.div>

      {/* Center Hero: Logo & Title */}
      <div className="flex flex-col items-center text-center my-auto w-full">
        {/* Animated Logo Entrance */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="relative mb-8"
        >
          {/* Glowing pulse aura */}
          <div className="absolute inset-0 bg-brand-400/30 rounded-3xl blur-xl animate-pulse-glow" />

          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-emerald-400 p-[2px] shadow-float">
            <div className="w-full h-full bg-slate-900/90 rounded-[22px] flex items-center justify-center backdrop-blur-sm">
              <div className="relative">
                <Wallet className="w-12 h-12 text-white" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 bg-emerald-400 text-slate-900 rounded-full p-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center space-x-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Track<span className="text-emerald-400">-Amount</span>
            </h1>
          </div>
          <p className="text-base text-brand-200/90 font-medium tracking-wide">
            Take Control of Your Money.
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1 leading-relaxed">
            Smart expenses, income budgeting, and AI-powered financial intelligence in one mobile app.
          </p>
        </motion.div>
      </div>

      {/* Bottom Section: Progress Bar & Direct Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full pb-6 space-y-4"
      >
        {/* Loading Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-medium text-slate-400 px-1">
            <span>Loading workspace</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-400 to-emerald-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Quick Skip / Continue Button */}
        <button
          onClick={handleSkip}
          className="w-full py-3.5 px-5 bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/15 rounded-2xl text-sm font-semibold text-white flex items-center justify-center space-x-2 transition-all backdrop-blur-sm"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </motion.div>
    </div>
  );
};

