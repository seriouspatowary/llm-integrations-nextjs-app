'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, getCategoryColor } from '@/lib/utils';
import { BottomNav } from '@/components/navigation/BottomNav';
import {
  ArrowLeft,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  Download,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const {
    thisMonthIncome,
    thisMonthExpenses,
    thisMonthSavings,
    categoryExpenses,
    currentUser,
    setCurrentView,
    showToast,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('November 2026');

  const budget = currentUser?.monthlyBudget || 60000;
  const savingsRate = Math.max(
    0,
    Math.round((thisMonthSavings / (thisMonthIncome || 1)) * 100)
  );

  // Daily average calculation (assuming 11 days passed in current month)
  const daysPassed = 11;
  const avgDailySpend = Math.round(thisMonthExpenses / daysPassed);

  const handleDownloadReport = () => {
    showToast(`Financial report for ${selectedMonth} generated successfully!`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-800 min-h-full">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md px-5 pt-3 pb-3 border-b border-slate-200/60 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2 className="text-base font-bold text-slate-900">
          Financial Reports
        </h2>

        <button
          onClick={handleDownloadReport}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-600 transition-colors shadow-2xs"
          title="Download Report"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Report Content */}
      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
        
        {/* Month Selector Pill */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-800">{selectedMonth}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Active Cycle
          </span>
        </div>

        {/* 3 KPI Badges */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-soft text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">Savings Rate</span>
            <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
              {savingsRate}%
            </span>
            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 rounded-sm inline-block mt-0.5">
              Target: 20%
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-soft text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">Avg. Daily Spend</span>
            <span className="text-base font-extrabold text-slate-800 mt-0.5 block">
              ₹{avgDailySpend.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 inline-block mt-0.5">
              11 Days Active
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-soft text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">Budget Cap</span>
            <span className="text-base font-extrabold text-brand-600 mt-0.5 block">
              ₹{Math.round(budget / 1000)}k
            </span>
            <span className="text-[9px] text-brand-700 bg-brand-50 px-1 rounded-sm inline-block mt-0.5">
              Personal Goal
            </span>
          </div>
        </div>

        {/* Category-Wise Expense Report */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <PieChart className="w-4 h-4 text-brand-600" />
              <span>Category Breakdown</span>
            </h4>
            <span className="text-xs font-bold text-rose-600">
              Total: {formatCurrency(thisMonthExpenses)}
            </span>
          </div>

          {categoryExpenses.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No expenses to display.</p>
          ) : (
            <div className="space-y-3.5">
              {categoryExpenses.map((cat, idx) => {
                const styling = getCategoryColor(cat.category, 'expense');

                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 text-slate-400 text-[11px] font-bold">
                          #{idx + 1}
                        </span>
                        <span
                          className="w-3 h-3 rounded-md shrink-0"
                          style={{ backgroundColor: styling.bar }}
                        />
                        <span className="text-slate-800">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-900 font-bold">
                          {formatCurrency(cat.amount)}
                        </span>
                        <span className="text-slate-400 text-[10px] ml-1.5">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(6, cat.percentage))}%`,
                          backgroundColor: styling.bar,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Financial Health Score Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-tr from-brand-950 via-brand-900 to-indigo-800 text-white shadow-soft space-y-2">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold tracking-wide uppercase text-brand-200">
              Financial Discipline Score
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-extrabold text-white">88 / 100</h3>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Grade A (Excellent)
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Your expense-to-income ratio is under 45% and you have consistently recorded transactions with valid payment methods.
          </p>
        </div>

        <div className="h-6" />
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

