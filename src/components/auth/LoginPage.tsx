
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Brain,
  CreditCard,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loginUser,
  clearAuthError,
} from "@/redux/features/auth/authSlice";

import { getDefaultScreen } from "@/lib/screenAccess";
import { setCurrentView } from "@/redux/features/navigation/navigationSlice";


type AccountRole = "expense_user" | "rag_user";

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error } = useAppSelector(
    (state) => state.auth
  );

  // Form state
  const [role, setRole] = useState<AccountRole>("expense_user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  // =================================
  // Login Handler
  // =================================



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim() || !password) return;

  try {
    const response = await dispatch(
      loginUser({
        email: email.trim(),
        password,
      })
    ).unwrap();

    console.log("Login response:", response);
    console.log("User roles:", response.user.roles);

    dispatch(setCurrentView("dashboard"));

    console.log("Dashboard navigation dispatched");
  } catch (err) {
    console.error("Login failed:", err);
  }
};
  // =================================
  // Role Selection
  // =================================

  const handleRoleSelect = (selectedRole: AccountRole) => {
    setRole(selectedRole);
    dispatch(clearAuthError());
  };

  // =================================
  // Forgot Password
  // =================================

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    // UI only: connect to a real reset API when available.
    setForgotMessage(
      "Password reset is not configured yet."
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 text-slate-800 overflow-y-auto">
      <div className="w-full max-w-sm mx-auto my-auto space-y-6 pt-2 pb-6">

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 shadow-float text-white mb-2"
          >
            <Wallet className="w-8 h-8" />
          </motion.div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h2>

          <p className="text-xs text-slate-500 font-medium">
            Manage your money smarter with Track-Amount.
          </p>
        </div>

        {/* Role Selector Card */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-1.5 pb-1">
            Select Account Role
          </p>

          <div className="grid grid-cols-2 gap-1.5">

            {/* Expense User */}
            <button
              type="button"
              onClick={() => handleRoleSelect("expense_user")}
              className={`flex items-center space-x-2 p-2.5 rounded-xl text-left transition-all ${
                role === "expense_user"
                  ? "bg-brand-50 border border-brand-200 text-brand-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  role === "expense_user"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold leading-none">
                  Expense User
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  Track & Budget
                </p>
              </div>
            </button>

            {/* RAG User */}
            <button
              type="button"
              onClick={() => handleRoleSelect("rag_user")}
              className={`flex items-center space-x-2 p-2.5 rounded-xl text-left transition-all ${
                role === "rag_user"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  role === "rag_user"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Brain className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold leading-none">
                  RAG User
                </p>
                <p className="text-[10px] text-emerald-700 mt-0.5 truncate">
                  AI Knowledge
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) dispatch(clearAuthError());
                }}
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotMessage("");
                  setForgotModalOpen(true);
                }}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) dispatch(clearAuthError());
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm"
              />

              <button
                type="button"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
              />
              <span className="text-xs font-medium text-slate-600">
                Remember Me
              </span>
            </label>

            <span className="text-[11px] text-slate-400">
              Secure Login
            </span>
          </div>

          {/* API Error */}
          {error && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-card flex items-center justify-center space-x-2 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2 ml-1"
            >
              Create New Account
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reset Password
            </h3>

            <p className="text-xs text-slate-500">
              Enter your email address to request a password reset.
            </p>

            <form
              onSubmit={handleForgotPassword}
              className="space-y-3"
            >
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              />

              {forgotMessage && (
                <p role="status" className="text-xs text-amber-700">
                  {forgotMessage}
                </p>
              )}

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
