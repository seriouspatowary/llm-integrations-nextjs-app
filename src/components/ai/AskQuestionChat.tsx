'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BottomNav } from '@/components/navigation/BottomNav';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User as UserIcon,
  Brain,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const AskQuestionChat: React.FC = () => {
  const {
    chatMessages,
    isAITyping,
    sendChatMessage,
    clearChat,
    currentUser,
    setCurrentView,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How much did I spend this month?',
    'What is my total income?',
    'Which category has the highest expenses?',
    'How much money did I save this month?',
    'Show my last 10 transactions.',
    'Compare this month\'s expenses with last month.',
    'Give me tips to reduce my expenses.',
  ];

  const isRag = currentUser?.role === 'rag_user';

  // Scroll to bottom on new message or typing
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAITyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isAITyping) return;
    const q = inputQuery.trim();
    setInputQuery('');
    await sendChatMessage(q);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isAITyping) return;
    await sendChatMessage(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-800 min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-indigo-600 to-emerald-400 p-[2px] shadow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                {isRag ? <Brain className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  Ask Track-Amount
                </h2>
                {isRag ? (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase">
                    RAG Mode
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-800 text-[9px] font-bold uppercase">
                    AI Assist
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Your personal financial assistant.
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* RAG Context Status Bar */}
        {isRag && (
          <div className="mt-2 py-1 px-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-[10px] text-emerald-800 font-medium">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Vector retrieval grounded on real-time transaction ledger</span>
            </span>
            <span className="font-bold">100% Synced</span>
          </div>
        )}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3.5">
        
        {/* Suggested Questions Carousel / Chip Cloud */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <HelpCircle className="w-3 h-3" />
            <span>Suggested Questions:</span>
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(q)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200/90 hover:border-brand-200 text-slate-700 hover:text-brand-700 text-xs font-medium transition-all shadow-2xs active:scale-[0.98]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message bubbles */}
        <div className="space-y-3 pt-1">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                    {msg.isRagAnalysis ? (
                      <Brain className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-soft ${
                    isUser
                      ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Structured Insights if present */}
                  {msg.insights && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2">
                      {msg.insights.highestCategory && (
                        <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">
                            🏆 {msg.insights.highestCategory.category}
                          </span>
                          <span className="font-bold text-rose-600">
                            {formatCurrency(msg.insights.highestCategory.amount)} ({msg.insights.highestCategory.percentage}%)
                          </span>
                        </div>
                      )}

                      {msg.insights.tips && (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[11px] font-bold text-brand-700 flex items-center space-x-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>Actionable Steps:</span>
                          </p>
                          <ul className="space-y-1 pl-1">
                            {msg.insights.tips.map((tip, i) => (
                              <li key={i} className="text-[11px] text-slate-600 flex items-start space-x-1.5">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-[9px] ${
                        isUser ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAITyping && (
            <div className="flex items-start space-x-2.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs p-3 shadow-soft flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="text-[11px] text-slate-400 pl-1 font-medium">
                  {isRag ? 'Searching ledger & synthesizing...' : 'Calculating metrics...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Bottom Chat Input Form */}
      <div className="bg-white border-t border-slate-200/80 px-4 py-3 safe-bottom space-y-2">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isRag
                ? 'Ask deep questions about expenses, receipts & savings...'
                : 'Ask Track-Amount about your spending...'
            }
            className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAITyping}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 text-white flex items-center justify-center disabled:opacity-40 transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

