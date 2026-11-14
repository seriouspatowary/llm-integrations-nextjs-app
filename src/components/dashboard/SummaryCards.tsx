'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Eye,
  EyeOff,
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const {
    totalBalance,
    thisMonthIncome,
    thisMonthExpenses,
    totalIncome,
    totalExpenses,
    currentUser,
  } = useApp();

  const [hideBalance, setHideBalance] = React.useState(false);

  const budget = currentUser?.monthlyBudget || 60000;
  const budgetUsagePercent = Math.min(
    100,
    Math.round((thisMonthExpenses / budget) * 100)
  );

  return (
    <div className="space-y-3.5">
      {/* 1. Primary Card: Total Balance (Luxury Fintech Card) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-brand-950 via-brand-800 to-indigo-700 text-white p-5 shadow-card border border-white/10"
      >
        {/* Card background decorative geometry */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-4 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-indigo-500/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between space-y-4">
          {/* Card Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15">
                <Wallet className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-xs font-semibold tracking-wider text-brand-200 uppercase">
                Total Available Balance
              </span>
            </div>
            
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-brand-200 transition-colors"
              title={hideBalance ? 'Show Balance' : 'Hide Balance'}
            >
              {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Amount Row */}
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-white font-sans">
                {hideBalance ? '••••••••' : formatCurrency(totalBalance)}
              </h3>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Active
              </span>
            </div>
            <p className="text-[11px] text-brand-200/80 font-medium">
              Net balance calculated dynamically across all income & outflows
            </p>
          </div>

          {/* Monthly Budget Tracker Bar inside Card */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-brand-200/90 font-medium">
                Monthly Budget: {formatCurrency(budget)}
              </span>
              <span className={`font-bold ${budgetUsagePercent > 80 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {budgetUsagePercent}% Spent
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUsagePercent > 80
                    ? 'bg-rose-400'
                    : budgetUsagePercent > 50
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${budgetUsagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Secondary Row: Total Income & Total Expenses Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Income Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-white p-4 border border-emerald-100 shadow-soft flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              + Inflow
            </span>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-500">
              Total Income
            </p>
            <h4 className="text-lg sm:text-xl font-bold text-emerald-600 tracking-tight mt-0.5">
              {hideBalance ? '••••' : formatCurrency(thisMonthIncome)}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">
              All-time: {formatCurrency(totalIncome)}
            </p>
          </div>
        </motion.div>

        {/* Expenses Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl bg-white p-4 border border-rose-100 shadow-soft flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              - Outflow
            </span>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-500">
              Total Expenses
            </p>
            <h4 className="text-lg sm:text-xl font-bold text-rose-600 tracking-tight mt-0.5">
              {hideBalance ? '••••' : formatCurrency(thisMonthExpenses)}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">
              All-time: {formatCurrency(totalExpenses)}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

