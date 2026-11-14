'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Sparkles, User, Settings, CheckCheck, ShieldCheck } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { currentUser, setCurrentView } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Salary Credited',
      desc: '₹85,000 deposited to your HDFC Bank Account.',
      time: '2h ago',
      type: 'income',
    },
    {
      id: 2,
      title: 'Monthly Budget Milestone',
      desc: 'You have utilized 48% of your ₹60,000 budget.',
      time: 'Yesterday',
      type: 'budget',
    },
    {
      id: 3,
      title: 'AI Smart Tip Available',
      desc: 'You can save ₹3,200 this month by adjusting dining out expenses.',
      time: '2 days ago',
      type: 'ai',
    },
  ];

  return (
    <div className="relative sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md px-5 pt-3 pb-3 border-b border-slate-200/60">
      <div className="flex items-center justify-between">
        
        {/* User Greeting & Profile Picture */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('profile')}
            className="relative group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-indigo-600 to-brand-500 p-[2px] shadow-sm transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                <span className="text-sm font-bold text-brand-700">
                  {currentUser?.name
                    ? currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()
                    : 'TA'}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </button>

          <div className="text-left">
            <p className="text-[11px] font-semibold text-slate-400 leading-tight">
              Hello, Welcome Back!
            </p>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                {currentUser?.name || 'User'}
              </h2>
              {currentUser?.role === 'rag_user' ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold tracking-wide uppercase">
                  RAG AI
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-800 text-[9px] font-bold tracking-wide uppercase">
                  Expense
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Icons: Notification & Settings */}
        <div className="flex items-center space-x-2">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-brand-600 hover:border-brand-200 transition-colors shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-brand-600 font-semibold flex items-center space-x-1 hover:underline"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pt-1">
                    {notifications.map((item) => (
                      <div key={item.id} className="py-2.5 px-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800">{item.title}</p>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setCurrentView('settings')}
            className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-brand-600 hover:border-brand-200 transition-colors shadow-2xs"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

