'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, getCategoryColor } from '@/lib/utils';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';

export const SpendingChart: React.FC = () => {
  const {
    categoryExpenses,
    thisMonthIncome,
    thisMonthExpenses,
    lastMonthIncome,
    lastMonthExpenses,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'flow' | 'category'>('flow');

  // Comparison data points
  const monthsData = [
    { label: 'Oct', income: lastMonthIncome, expense: lastMonthExpenses },
    { label: 'Nov (Now)', income: thisMonthIncome, expense: thisMonthExpenses },
  ];

  const maxVal = Math.max(
    ...monthsData.map((d) => Math.max(d.income, d.expense)),
    100000
  );

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft space-y-4">
      {/* Chart Header & Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-1.5">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span>Financial Analytics</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {activeTab === 'flow' ? 'Income vs Expense Trend' : 'Top Expense Categories'}
          </p>
        </div>

        {/* Tab switch pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              activeTab === 'flow'
                ? 'bg-white text-brand-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 text-slate-500'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cashflow</span>
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              activeTab === 'category'
                ? 'bg-white text-brand-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 text-slate-500'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Income vs Expense Flow Chart */}
      {activeTab === 'flow' && (
        <div className="space-y-4 pt-1">
          {/* Visual Bar Comparison */}
          <div className="h-44 flex items-end justify-around pt-6 pb-2 px-2 border-b border-slate-100">
            {monthsData.map((item, idx) => {
              const incHeight = Math.max(12, Math.round((item.income / maxVal) * 120));
              const expHeight = Math.max(12, Math.round((item.expense / maxVal) * 120));

              return (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <div className="flex items-end space-x-3">
                    {/* Income Bar */}
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600">
                        {item.income >= 1000 ? `${Math.round(item.income / 1000)}k` : item.income}
                      </span>
                      <div
                        className="w-7 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl transition-all duration-500 shadow-sm"
                        style={{ height: `${incHeight}px` }}
                      />
                    </div>

                    {/* Expense Bar */}
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-[10px] font-bold text-rose-500">
                        {item.expense >= 1000 ? `${Math.round(item.expense / 1000)}k` : item.expense}
                      </span>
                      <div
                        className="w-7 bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-xl transition-all duration-500 shadow-sm"
                        style={{ height: `${expHeight}px` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 pt-1">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend and Delta pill */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span className="text-slate-600 text-[11px] font-medium">Income</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-500" />
                <span className="text-slate-600 text-[11px] font-medium">Expenses</span>
              </div>
            </div>

            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              Net Savings: +{formatCurrency(thisMonthIncome - thisMonthExpenses)}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Category Breakdown */}
      {activeTab === 'category' && (
        <div className="space-y-3 pt-1">
          {categoryExpenses.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No expense categories recorded yet.
            </p>
          ) : (
            categoryExpenses.slice(0, 5).map((cat) => {
              const styling = getCategoryColor(cat.category, 'expense');
              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: styling.bar }}
                      />
                      <span>{cat.category}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        ({cat.count} tx)
                      </span>
                    </span>
                    <div className="text-right">
                      <span className="text-slate-900">{formatCurrency(cat.amount)}</span>
                      <span className="text-slate-400 text-[10px] ml-1.5 font-normal">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(8, cat.percentage))}%`,
                        backgroundColor: styling.bar,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

