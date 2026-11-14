'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Transaction } from '@/types';
import { formatCurrency, formatDate, getCategoryColor } from '@/lib/utils';
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Receipt,
  FileText,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  X,
} from 'lucide-react';

export const RecentTransactions: React.FC = () => {
  const { transactions, setCurrentView, deleteTransaction } = useApp();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const recentList = transactions.slice(0, 5);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
          Recent Transactions
        </h4>
        <button
          onClick={() => setCurrentView('transactions')}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-0.5"
        >
          <span>View All ({transactions.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transactions list */}
      {recentList.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/80 shadow-soft">
          <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">No transactions recorded yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Use the bottom tabs to add your first expense or income.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft divide-y divide-slate-100 overflow-hidden">
          {recentList.map((tx) => {
            const isIncome = tx.type === 'income';
            const catColors = getCategoryColor(tx.category, tx.type);

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 active:bg-slate-100 transition-colors cursor-pointer group"
              >
                {/* Left: Icon & Title/Date */}
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-700 transition-colors">
                      {tx.title}
                    </p>
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span className={`font-semibold ${catColors.text}`}>
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      {tx.receiptName && (
                        <span className="flex items-center text-brand-600 font-medium">
                          • <FileText className="w-2.5 h-2.5 ml-0.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Method */}
                <div className="text-right shrink-0">
                  <p
                    className={`text-xs sm:text-sm font-extrabold ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {tx.paymentMethod}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transaction Details
              </span>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Amount Banner */}
            <div className="text-center py-2 space-y-1">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-1 ${
                  selectedTx.type === 'income'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {selectedTx.type === 'income' ? (
                  <ArrowUpRight className="w-6 h-6" />
                ) : (
                  <ArrowDownRight className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">{selectedTx.title}</h3>
              <p
                className={`text-2xl font-extrabold ${
                  selectedTx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {selectedTx.type === 'income' ? '+' : '-'} {formatCurrency(selectedTx.amount)}
              </p>
            </div>

            {/* Meta Rows */}
            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category</span>
                </span>
                <span className="font-semibold text-slate-800">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Payment Method</span>
                </span>
                <span className="font-semibold text-slate-800">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Date</span>
                </span>
                <span className="font-semibold text-slate-800">{formatDate(selectedTx.date)}</span>
              </div>
              {selectedTx.receiptName && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Attached Receipt</span>
                  </span>
                  <span className="font-semibold text-brand-600 truncate max-w-[140px]">
                    {selectedTx.receiptName}
                  </span>
                </div>
              )}
              {selectedTx.notes && (
                <div className="pt-2 border-t border-slate-200/60 text-slate-600">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                    Notes
                  </span>
                  <p className="mt-0.5 text-xs italic">"{selectedTx.notes}"</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  deleteTransaction(selectedTx.id);
                  setSelectedTx(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

