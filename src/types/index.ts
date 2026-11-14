export type UserRole = 'expense_user' | 'rag_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  monthlyBudget: number;
  currency: string;
  phone?: string;
  joinedDate: string;
}

export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Shopping'
  | 'Medical'
  | 'Education'
  | 'Entertainment'
  | 'Rent'
  | 'Bills'
  | 'Others';

export type IncomeCategory =
  | 'Salary'
  | 'Business'
  | 'Freelancing'
  | 'Investment'
  | 'Rental Income'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Debit Card'
  | 'Credit Card'
  | 'Bank Transfer'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: ExpenseCategory | IncomeCategory;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  notes?: string;
  receiptName?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  insights?: {
    totalSpent?: number;
    totalEarned?: number;
    highestCategory?: { category: string; amount: number; percentage: number };
    savingsAmount?: number;
    savingsRate?: number;
    transactionCount?: number;
    tips?: string[];
  };
  isRagAnalysis?: boolean;
}

export type AppView =
  | 'splash'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'add-expense'
  | 'add-income'
  | 'ask-question'
  | 'transactions'
  | 'reports'
  | 'profile'
  | 'settings';

