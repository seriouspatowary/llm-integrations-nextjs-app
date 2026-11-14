'use client';

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/features/auth/authSlice";
import { UserRole } from '@/types';
import { motion } from 'framer-motion';
import {
  Wallet,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
 const dispatch = useAppDispatch();
const router = useRouter();

const { loading, error } = useAppSelector(
  (state) => state.auth
);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('expense_user');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!termsAgreed) {
      newErrors.terms = 'You must agree to the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  try {
    await dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role:
          role === "rag_user"
            ? "FAKE_NEWS_USER"
            : "EXPENSE_USER",
      })
    ).unwrap();

    router.push("/");
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 text-slate-800 overflow-y-auto">
      <div className="w-full max-w-sm mx-auto my-auto space-y-5 pt-2 pb-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-emerald-500 shadow-float text-white mb-1"
          >
            <Wallet className="w-7 h-7" />
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="text-xs text-slate-500">
            Join Track-Amount to manage expenses and unlock AI insights.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Altaf Hussain"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-brand-500'
                } rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="altaf@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-brand-500'
                } rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 font-medium">{errors.email}</p>}
          </div>

          {/* Role Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              User Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
            >
              <option value="expense_user">💳 Expense User (Personal Tracker & Budgeting)</option>
              <option value="rag_user">🧠 RAG User (AI Knowledge & Retrieval Mode)</option>
            </select>
            <p className="text-[10px] text-slate-400">
              {role === 'rag_user'
                ? '✨ Gives you access to AI document context, spending synthesis, and semantic lookups.'
                : '📊 Standard financial tracker with income, expense categories, and monthly summaries.'}
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                  errors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-brand-500'
                } rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                  errors.confirmPassword
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-200 focus:ring-brand-500'
                } rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
              />
              <span className="text-xs text-slate-600 leading-tight">
                I agree to the <span className="font-semibold text-slate-900">Terms of Service</span> and{' '}
                <span className="font-semibold text-slate-900">Privacy Policy</span>.
              </span>
            </label>
            {errors.terms && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.terms}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-700 via-indigo-600 to-emerald-600 hover:opacity-95 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-card flex items-center justify-center space-x-2 transition-all pt-3"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2 ml-1"
            >
              Log In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};


export default RegisterPage;