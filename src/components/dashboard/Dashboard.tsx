'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TopHeader } from '@/components/layout/TopHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BottomNav } from '@/components/navigation/BottomNav';
import { motion } from 'framer-motion';
import {
  MinusCircle,
  PlusCircle,
  Sparkles,
  BarChart2,
  Brain,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, setCurrentView, thisMonthSavings } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-800 min-h-full">
      {/* Top Header */}
      <TopHeader />

      {/* Scrollable Dashboard Body */}
      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
        
        {/* RAG User Special Intelligence Banner */}
        {currentUser?.role === 'rag_user' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-brand-950 to-slate-900 text-white shadow-soft border border-emerald-500/30 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    RAG Knowledge Engine Active
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  Ready to answer deep financial queries using your stored transaction records.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('ask-question')}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center space-x-1 ml-2"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* 1. Summary Cards */}
        <SummaryCards />

        {/* 2. Quick Action Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-900 tracking-tight px-1">
            Quick Actions
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setCurrentView('add-expense')}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-rose-50/70 border border-slate-200/80 hover:border-rose-200 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <MinusCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 group-hover:text-rose-700">
                Expense
              </span>
            </button>

            <button
              onClick={() => setCurrentView('add-income')}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-700">
                Income
              </span>
            </button>

            <button
              onClick={() => setCurrentView('ask-question')}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-brand-50/70 border border-slate-200/80 hover:border-brand-200 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 group-hover:text-brand-700">
                Ask AI
              </span>
            </button>

            <button
              onClick={() => setCurrentView('reports')}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">
                Reports
              </span>
            </button>
          </div>
        </div>

        {/* 3. Monthly Spending & Income vs Expense Chart */}
        <SpendingChart />

        {/* 4. Recent Transactions */}
        <RecentTransactions />

        {/* Subtle padding bottom to ensure scroll clears fixed bottom navigation */}
        <div className="h-6" />
      </div>

      {/* Main Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

