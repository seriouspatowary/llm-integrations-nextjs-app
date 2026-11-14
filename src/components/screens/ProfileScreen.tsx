'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BottomNav } from '@/components/navigation/BottomNav';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Shield,
  CreditCard,
  Edit3,
  Calendar,
  CheckCircle2,
  X,
  Sparkles,
  Phone,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { currentUser, updateUserProfile, setCurrentView, showToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [monthlyBudget, setMonthlyBudget] = useState(currentUser?.monthlyBudget?.toString() || '60000');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email cannot be blank', 'error');
      return;
    }

    const budgetNum = parseFloat(monthlyBudget) || 60000;

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      monthlyBudget: budgetNum,
      phone: phone.trim(),
    });

    setIsEditing(false);
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
          User Profile
        </h2>

        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-600 transition-colors shadow-2xs"
          title="Edit Profile"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Body */}
      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
        
        {/* Avatar & Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft text-center space-y-3">
          <div className="relative inline-block mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-700 via-indigo-600 to-emerald-400 p-[3px] shadow-float">
              <div className="w-full h-full bg-slate-900 rounded-[21px] flex items-center justify-center text-white text-2xl font-bold">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  : 'TA'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{currentUser?.email}</p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-100">
            {currentUser?.role === 'rag_user' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>RAG User (AI Knowledge Tier)</span>
              </>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5 text-brand-600" />
                <span>Expense User (Standard Tier)</span>
              </>
            )}
          </div>
        </div>

        {/* Account Details Information List */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Personal Information
          </h4>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>Full Name</span>
              </span>
              <span className="font-bold text-slate-800">{currentUser?.name}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-500 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </span>
              <span className="font-bold text-slate-800">{currentUser?.email}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-500 flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </span>
              <span className="font-bold text-slate-800">{currentUser?.phone || '+91 98765 43210'}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-500 flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Monthly Budget</span>
              </span>
              <span className="font-bold text-emerald-600">
                {formatCurrency(currentUser?.monthlyBudget || 60000)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-500 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Member Since</span>
              </span>
              <span className="font-bold text-slate-800">
                {currentUser?.joinedDate || 'January 2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Edit Button */}
        <button
          onClick={() => setIsEditing(true)}
          className="w-full py-3.5 px-4 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-2xl text-xs font-bold border border-brand-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile & Budget</span>
        </button>

        <div className="h-6" />
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">
                Edit Profile
              </span>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

