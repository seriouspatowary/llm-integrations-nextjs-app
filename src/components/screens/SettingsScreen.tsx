'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BottomNav } from '@/components/navigation/BottomNav';
import { UserRole } from '@/types';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  LogOut,
  RotateCcw,
  Shield,
  CreditCard,
  Brain,
  BellRing,
  Globe,
  Sliders,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    currentUser,
    switchRole,
    logout,
    resetToSampleData,
    setCurrentView,
    showToast,
  } = useApp();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('₹ (INR)');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(true);

  const handleRoleToggle = (newRole: UserRole) => {
    switchRole(newRole);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
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
          App Settings
        </h2>

        <div className="w-8" />
      </div>

      {/* Settings List */}
      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
        
        {/* Role Switcher Section */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Active Experience Role
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Switch between standard expense tracking and AI RAG knowledge retrieval mode.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleRoleToggle('expense_user')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                currentUser?.role === 'expense_user'
                  ? 'bg-brand-50 border-brand-300 text-brand-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <CreditCard className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold">Expense User</span>
              </div>
              <span className="text-[10px] text-slate-500 block leading-tight">
                Standard logging, budgeting & charts
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleToggle('rag_user')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                currentUser?.role === 'rag_user'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <Brain className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold">RAG User</span>
              </div>
              <span className="text-[10px] text-emerald-700 block leading-tight">
                AI vector search, receipts & insights
              </span>
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Preferences & Security
          </h4>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            {/* Currency */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600 flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Base Currency</span>
              </span>
              <select
                value={selectedCurrency}
                onChange={(e) => {
                  setSelectedCurrency(e.target.value);
                  showToast(`Default currency set to ${e.target.value}`, 'info');
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
              >
                <option value="₹ (INR)">₹ INR (Indian Rupee)</option>
                <option value="$ (USD)">$ USD (US Dollar)</option>
                <option value="€ (EUR)">€ EUR (Euro)</option>
                <option value="£ (GBP)">£ GBP (British Pound)</option>
              </select>
            </div>

            {/* Budget Alert Toggle */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-600 flex items-center space-x-2">
                <BellRing className="w-4 h-4" />
                <span>80% Budget Overrun Alerts</span>
              </span>
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </div>

            {/* Biometrics */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-600 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Biometric / FaceID Lock</span>
              </span>
              <input
                type="checkbox"
                checked={biometricAuth}
                onChange={(e) => setBiometricAuth(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Demo & Data Management */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Data Management
          </h4>

          <button
            onClick={resetToSampleData}
            className="w-full py-3 px-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Restore Demo Transactions</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Track-Amount</span>
        </button>

        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-400">
            Track-Amount v1.0.0 • Production Build
          </p>
        </div>

        <div className="h-6" />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Log Out
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to end your current session? You can log back in anytime.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Log Out
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

