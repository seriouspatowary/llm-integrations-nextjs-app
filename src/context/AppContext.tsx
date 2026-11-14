'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Transaction,
  AppView,
  ChatMessage,
  ExpenseCategory,
  IncomeCategory,
  PaymentMethod,
} from '@/types';
import { INITIAL_USERS, INITIAL_TRANSACTIONS } from '@/lib/mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  transactions: Transaction[];
  addExpense: (expense: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    paymentMethod: PaymentMethod;
    date: string;
    notes?: string;
    receiptName?: string;
  }) => void;
  addIncome: (income: {
    title: string;
    amount: number;
    category: IncomeCategory;
    paymentMethod: PaymentMethod;
    date: string;
    notes?: string;
  }) => void;
  deleteTransaction: (id: string) => void;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  register: (data: { name: string; email: string; role: UserRole }) => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<User>) => void;
  resetToSampleData: () => void;
  
  // Financial metrics
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
  thisMonthSavings: number;
  lastMonthExpenses: number;
  lastMonthIncome: number;
  categoryExpenses: Array<{ category: string; amount: number; percentage: number; count: number }>;
  
  // UI & Chat
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  chatMessages: ChatMessage[];
  isAITyping: boolean;
  sendChatMessage: (questionText: string) => Promise<void>;
  clearChat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'track_amount_user';
const STORAGE_KEY_TX = 'track_amount_transactions';
const STORAGE_KEY_CHAT = 'track_amount_chat';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      const savedTx = localStorage.getItem(STORAGE_KEY_TX);
      const savedChat = localStorage.getItem(STORAGE_KEY_CHAT);

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      if (savedTx) {
        const parsed = JSON.parse(savedTx);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        }
      }
      if (savedChat) {
        setChatMessages(JSON.parse(savedChat));
      } else {
        // Default welcoming message
        setChatMessages([
          {
            id: 'msg_welcome',
            sender: 'assistant',
            text: "Hello! I'm your Track-Amount AI Financial Assistant. Ask me anything about your income, monthly spending patterns, top categories, or how to save more!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e) {
      console.error('Error loading stored data:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(chatMessages));
    } catch (e) {
      console.error(e);
    }
  }, [chatMessages, isInitialized]);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Financial Metrics Calculation
  const metrics = useMemo(() => {
    let incTotal = 0;
    let expTotal = 0;

    // Use current month (2026-11 or current year-month)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let thisMonthInc = 0;
    let thisMonthExp = 0;
    let lastMonthInc = 0;
    let lastMonthExp = 0;

    const categoryMap: Record<string, { amount: number; count: number }> = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      const txDate = new Date(tx.date);
      const isThisMonth = txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
      
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const isLastMonth = txDate.getFullYear() === prevMonthYear && txDate.getMonth() === prevMonth;

      if (tx.type === 'income') {
        incTotal += amt;
        if (isThisMonth) thisMonthInc += amt;
        if (isLastMonth) lastMonthInc += amt;
      } else {
        expTotal += amt;
        if (isThisMonth) thisMonthExp += amt;
        if (isLastMonth) lastMonthExp += amt;

        if (isThisMonth || transactions.length < 15) {
          if (!categoryMap[tx.category]) {
            categoryMap[tx.category] = { amount: 0, count: 0 };
          }
          categoryMap[tx.category].amount += amt;
          categoryMap[tx.category].count += 1;
        }
      }
    });

    const netBalance = incTotal - expTotal;
    const thisSavings = thisMonthInc - thisMonthExp;

    const baseForCategory = thisMonthExp > 0 ? thisMonthExp : expTotal || 1;
    const categoryExpenses = Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: Math.round((data.amount / baseForCategory) * 100) || 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalIncome: incTotal,
      totalExpenses: expTotal,
      totalBalance: netBalance,
      thisMonthIncome: thisMonthInc || incTotal,
      thisMonthExpenses: thisMonthExp || expTotal,
      thisMonthSavings: thisSavings,
      lastMonthExpenses: lastMonthExp || 43400,
      lastMonthIncome: lastMonthInc || 85000,
      categoryExpenses,
    };
  }, [transactions]);

  // Add Expense
  const addExpense = (data: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    paymentMethod: PaymentMethod;
    date: string;
    notes?: string;
    receiptName?: string;
  }) => {
    const newTx: Transaction = {
      id: 'tx_exp_' + Date.now(),
      type: 'expense',
      title: data.title.trim(),
      amount: Number(data.amount),
      category: data.category,
      paymentMethod: data.paymentMethod,
      date: data.date,
      notes: data.notes?.trim(),
      receiptName: data.receiptName,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Expense of ₹${data.amount.toLocaleString()} added successfully!`, 'success');
  };

  // Add Income
  const addIncome = (data: {
    title: string;
    amount: number;
    category: IncomeCategory;
    paymentMethod: PaymentMethod;
    date: string;
    notes?: string;
  }) => {
    const newTx: Transaction = {
      id: 'tx_inc_' + Date.now(),
      type: 'income',
      title: data.title.trim(),
      amount: Number(data.amount),
      category: data.category,
      paymentMethod: data.paymentMethod,
      date: data.date,
      notes: data.notes?.trim(),
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Income of ₹${data.amount.toLocaleString()} credited successfully!`, 'success');
  };

  // Delete Transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed', 'info');
  };

  // Login
  const login = (role: UserRole, email?: string, name?: string) => {
    const baseUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    const userToSet: User = {
      ...baseUser,
      role,
      email: email || baseUser.email,
      name: name || baseUser.name,
    };

    setCurrentUser(userToSet);
    setCurrentView('dashboard');
    showToast(`Welcome back, ${userToSet.name}!`, 'success');
  };

  // Register
  const register = (data: { name: string; email: string; role: UserRole }) => {
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      monthlyBudget: data.role === 'rag_user' ? 80000 : 60000,
      currency: '₹',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(newUser);
    setCurrentView('dashboard');
    showToast(`Account registered successfully as ${data.role === 'rag_user' ? 'RAG User' : 'Expense User'}!`, 'success');
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    showToast('Logged out successfully', 'info');
  };

  // Switch Role
  const switchRole = (newRole: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      showToast(`Switched to ${newRole === 'rag_user' ? 'RAG User (AI Knowledge Engine)' : 'Expense User'}`, 'info');
    }
  };

  // Update Profile
  const updateUserProfile = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...data });
      showToast('Profile updated successfully!', 'success');
    }
  };

  // Reset Data to Initial
  const resetToSampleData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    showToast('Reset to demo sample transactions', 'info');
  };

  // Clear AI chat
  const clearChat = () => {
    setChatMessages([
      {
        id: 'msg_welcome_' + Date.now(),
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist you with your financial analysis today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Mock AI Engine with RAG (Retrieval-Augmented Generation) Knowledge Synthesizer
  const sendChatMessage = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_usr_' + Date.now(),
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAITyping(true);

    // Simulate AI thinking and retrieval
    await new Promise((res) => setTimeout(res, 900));

    const q = questionText.toLowerCase();
    const isRag = currentUser?.role === 'rag_user';

    let answerText = '';
    let insights: ChatMessage['insights'] = undefined;

    // RAG synthesis & query answering:
    if (q.includes('spend') || q.includes('spent') || q.includes('how much did i spend')) {
      const spent = metrics.thisMonthExpenses;
      const budget = currentUser?.monthlyBudget || 60000;
      const budgetRemaining = budget - spent;
      const budgetPct = Math.round((spent / budget) * 100);

      answerText = `You have spent **₹${spent.toLocaleString()}** this month. `;
      if (budgetPct > 80) {
        answerText += `⚠️ You have consumed **${budgetPct}%** of your monthly budget (₹${budget.toLocaleString()}), leaving ₹${budgetRemaining.toLocaleString()} for the rest of the period.`;
      } else {
        answerText += `✅ You are well within your monthly target of ₹${budget.toLocaleString()} (${budgetPct}% utilized).`;
      }

      if (isRag) {
        answerText += `\n\n🔍 **[RAG Knowledge Retrieval]**: Retrieved 7 matching expense records for November 2026. Largest single outflow was Rent (₹22,000) followed by Shopping (₹5,400).`;
      }

      insights = {
        totalSpent: spent,
        savingsRate: Math.max(0, Math.round(((metrics.thisMonthIncome - spent) / (metrics.thisMonthIncome || 1)) * 100)),
      };
    } else if (q.includes('income') || q.includes('total income') || q.includes('earn')) {
      const inc = metrics.thisMonthIncome;
      answerText = `Your total registered income this month is **₹${inc.toLocaleString()}**, with an all-time recorded income of **₹${metrics.totalIncome.toLocaleString()}**.`;
      
      if (isRag) {
        answerText += `\n\n📊 **[RAG Synthesis]**: Top income streams: Primary Salary (₹85,000) + Freelance Projects (₹22,500) + Investment Dividends (₹4,800). Net cashflow remains strongly positive.`;
      }

      insights = {
        totalEarned: inc,
        savingsAmount: metrics.thisMonthSavings,
      };
    } else if (q.includes('highest') || q.includes('category') || q.includes('where is my money going')) {
      const top = metrics.categoryExpenses[0];
      if (top) {
        answerText = `Your highest spending category is **${top.category}** with **₹${top.amount.toLocaleString()}** (${top.percentage}% of your expenses across ${top.count} transactions).`;
        if (metrics.categoryExpenses.length > 1) {
          const second = metrics.categoryExpenses[1];
          answerText += ` Followed by **${second.category}** at ₹${second.amount.toLocaleString()} (${second.percentage}%).`;
        }
        insights = {
          highestCategory: top,
        };
      } else {
        answerText = 'No expense transactions recorded yet to determine category rankings.';
      }

      if (isRag) {
        answerText += `\n\n💡 **[RAG Strategy]**: Rent constitutes fixed recurring overhead. To optimize discretionary outflows, focus on optimizing Food (₹7,500 cumulative) and Shopping (₹5,400).`;
      }
    } else if (q.includes('save') || q.includes('savings') || q.includes('saved')) {
      const savings = metrics.thisMonthSavings;
      const rate = Math.round((savings / (metrics.thisMonthIncome || 1)) * 100);
      answerText = `You have saved **₹${savings.toLocaleString()}** this month! That equates to a healthy **${rate}% savings rate** from your total monthly earnings.`;
      
      if (isRag) {
        answerText += `\n\n🎯 **[RAG Wealth Advisor]**: Standard financial rule of thumb (50/30/20) recommends allocating at least 20% to savings. With your current ${rate}% rate, you are exceeding benchmark targets!`;
      }

      insights = {
        savingsAmount: savings,
        savingsRate: rate,
      };
    } else if (q.includes('last 10') || q.includes('transactions') || q.includes('recent')) {
      const recent = transactions.slice(0, 5);
      answerText = `Here is a summary of your recent ${recent.length} transactions:\n\n` +
        recent
          .map(
            (t, i) =>
              `${i + 1}. **${t.title}** – ${t.type === 'income' ? '+₹' : '-₹'}${t.amount.toLocaleString()} (${t.category}, ${t.paymentMethod})`
          )
          .join('\n');
      
      if (isRag) {
        answerText += `\n\n📑 **[RAG Indexer]**: All transactions have been indexed with full audit metadata and timestamps.`;
      }
    } else if (q.includes('compare') || q.includes('last month') || q.includes('vs')) {
      const diff = metrics.thisMonthExpenses - metrics.lastMonthExpenses;
      const diffPct = Math.round((Math.abs(diff) / (metrics.lastMonthExpenses || 1)) * 100);
      
      if (diff > 0) {
        answerText = `This month's expenses (**₹${metrics.thisMonthExpenses.toLocaleString()}**) are **₹${Math.abs(diff).toLocaleString()} (${diffPct}%) higher** than last month (₹${metrics.lastMonthExpenses.toLocaleString()}).`;
      } else {
        answerText = `Great job! This month's expenses (**₹${metrics.thisMonthExpenses.toLocaleString()}**) are **₹${Math.abs(diff).toLocaleString()} (${diffPct}%) lower** than last month (₹${metrics.lastMonthExpenses.toLocaleString()}).`;
      }

      if (isRag) {
        answerText += `\n\n📈 **[RAG Time-Series Delta]**: October had higher festive shopping expenditures (₹12,500), whereas November spending has been stabilized toward essentials.`;
      }
    } else if (q.includes('tip') || q.includes('reduce') || q.includes('advice') || q.includes('help')) {
      answerText = `Here are 4 personalized financial optimization tips based on your spending history:`;
      insights = {
        tips: [
          'Set a weekly dining & food delivery ceiling of ₹2,500.',
          'Review recurring subscriptions & utilities to trim redundant bills.',
          'Shift non-urgent shopping into end-of-season sales or use cashback cards.',
          'Automate a transfer of ₹20,000 on salary day into an index fund / high-yield deposit.',
        ],
      };

      if (isRag) {
        answerText += `\n\n🛡️ **[RAG Document Context]**: Synthesized from personal financial planning heuristics and your 90-day cash outflow analysis.`;
      }
    } else {
      // General question
      answerText = `Based on your records, your current available balance is **₹${metrics.totalBalance.toLocaleString()}** across **${transactions.length} logged entries**.`;
      if (isRag) {
        answerText += `\n\nAs a **RAG User**, you have access to semantic vector search over transactions, receipt metadata, and future PDF document imports!`;
      } else {
        answerText += `\n\nYou can ask about monthly spending, income, top categories, or savings advice!`;
      }
    }

    const aiMsg: ChatMessage = {
      id: 'msg_ai_' + Date.now(),
      sender: 'assistant',
      text: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      insights,
      isRagAnalysis: isRag,
    };

    setChatMessages((prev) => [...prev, aiMsg]);
    setIsAITyping(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentView,
        setCurrentView,
        transactions,
        addExpense,
        addIncome,
        deleteTransaction,
        login,
        logout,
        register,
        switchRole,
        updateUserProfile,
        resetToSampleData,
        ...metrics,
        toasts,
        showToast,
        removeToast,
        chatMessages,
        isAITyping,
        sendChatMessage,
        clearChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

