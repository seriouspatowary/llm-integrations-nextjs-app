'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Transaction, TransactionType } from '@/types';
import { formatCurrency, formatDate, getCategoryColor } from '@/lib/utils';
import { BottomNav } from '@/components/navigation/BottomNav';
import {
  ArrowLeft,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  FileText,
  Calendar,
  CreditCard,
  Tag,
  Receipt,
  X,
  Download,
} from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const { transactions, setCurrentView, deleteTransaction, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'expense' | 'income'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Categories present in transactions
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  // Filtered transactions
  const filteredList = useMemo(() => {
    return transactions.filter((tx) => {
      if (activeTab !== 'all' && tx.type !== activeTab) return false;
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          tx.title.toLowerCase().includes(term) ||
          tx.category.toLowerCase().includes(term) ||
          tx.paymentMethod.toLowerCase().includes(term) ||
          (tx.notes && tx.notes.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [transactions, activeTab, selectedCategory, searchTerm]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Title', 'Amount (INR)', 'Category', 'PaymentMethod', 'Date', 'Notes'];
    const rows = filteredList.map((t) => [
      t.id,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.category,
      t.paymentMethod,
      t.date,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `track_amount_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transactions exported as CSV file', 'success');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-800 min-h-full">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md px-5 pt-3 pb-3 border-b border-slate-200/60 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h2 className="text-base font-bold text-slate-900">
            Transaction History
          </h2>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-600 transition-colors shadow-2xs"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers: All | All Expenses | All Income */}
        <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'expense'
                ? 'bg-rose-500 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expenses Only
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'income'
                ? 'bg-emerald-500 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income Only
          </button>
        </div>

        {/* Search input & Category filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, notes, method..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-soft space-y-2">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No matching transactions</p>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or filter selections.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft divide-y divide-slate-100 overflow-hidden">
            {filteredList.map((tx) => {
              const isIncome = tx.type === 'income';
              const catColors = getCategoryColor(tx.category, tx.type);

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
                >
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

        <div className="h-6" />
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transaction Details
              </span>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <h3 className="text-base font-bold text-slate-900">{selectedTx.title}</h3>
              <p
                className={`text-2xl font-extrabold ${
                  selectedTx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {selectedTx.type === 'income' ? '+' : '-'} {formatCurrency(selectedTx.amount)}
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-800">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-800">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-800">{formatDate(selectedTx.date)}</span>
              </div>
              {selectedTx.receiptName && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Receipt</span>
                  <span className="font-semibold text-brand-600">{selectedTx.receiptName}</span>
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

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  deleteTransaction(selectedTx.id);
                  setSelectedTx(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

