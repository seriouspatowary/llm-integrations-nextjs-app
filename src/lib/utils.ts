import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "₹"): string {
  const formattedNumber = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currency} ${formattedNumber}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getCategoryColor(category: string, type: 'expense' | 'income' = 'expense'): { bg: string; text: string; border: string; bar: string } {
  if (type === 'income') {
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      bar: '#10B981',
    };
  }

  const colorMap: Record<string, { bg: string; text: string; border: string; bar: string }> = {
    Food: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: '#F59E0B' },
    Travel: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', bar: '#0284C7' },
    Shopping: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', bar: '#8B5CF6' },
    Medical: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', bar: '#F43F5E' },
    Education: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', bar: '#6366F1' },
    Entertainment: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', bar: '#EC4899' },
    Rent: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: '#3B82F6' },
    Bills: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', bar: '#F97316' },
    Others: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', bar: '#64748B' },
  };

  return colorMap[category] || { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', bar: '#4F46E5' };
}

