
"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowDownLeft,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createIncome,
  fetchIncomes,
} from "@/redux/features/income/incomeSlice";
import { useScreenNavigation } from "@/hooks/useScreenNavigation";
import { BottomNav } from "../navigation/BottomNav";

export const AddIncomeForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { navigate } = useScreenNavigation();

  const { incomes, loading, error } = useAppSelector(
    (state) => state.income
  );

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch incomes when screen mounts
  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  // Sort newest first and show 5 by default
  const sortedIncomes = [...incomes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  const visibleIncomes = showAll
    ? sortedIncomes
    : sortedIncomes.slice(0, 5);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const incomeAmount = Number(amount);

    if (
      !title.trim() ||
      !Number.isFinite(incomeAmount) ||
      incomeAmount <= 0
    ) {
      return;
    }

    try {
      setSubmitting(true);

      await dispatch(
        createIncome({
          title: title.trim(),
          amount: incomeAmount,
        })
      ).unwrap();

      setTitle("");
      setAmount("");

      // Refresh records after saving
      await dispatch(fetchIncomes()).unwrap();
    } catch (err) {
      console.error("Income API failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (incomeId: string) => {
    console.log("Edit income:", incomeId);
    // Next: dispatch(updateIncome(...))
  };

  const handleDelete = (incomeId: string) => {
    console.log("Delete income:", incomeId);
    // Next: dispatch(deleteIncome(incomeId))
  };

  const formatAmount = (value: number | string) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full bg-slate-50">

      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => navigate("dashboard")}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-900">
            Add Income
          </h1>
          <p className="text-xs text-slate-400">
            Manage your income
          </p>
        </div>

        <div className="w-10" />
      </header>

      {/* Single scrollable area */}
      <main className="flex-1 min-h-0 overflow-y-auto px-5 pt-6 pb-8 space-y-8">

        {/* Add Income Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="income-title"
              className="block text-sm font-semibold text-slate-700"
            >
              Income Title
            </label>

            <input
              id="income-title"
              type="text"
              placeholder="e.g. Monthly Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={150}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="income-amount"
              className="block text-sm font-semibold text-slate-700"
            >
              Amount (₹)
            </label>

            <input
              id="income-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Income"
            )}
          </button>
        </form>

        {/* Recent Income */}
        <section className="space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Income
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {incomes.length} transactions
              </p>
            </div>

            {incomes.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1 text-sm font-semibold text-emerald-600"
              >
                {showAll ? "Show Less" : "View All"}

                {showAll ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {loading && incomes.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : error && incomes.length === 0 ? (
            <p className="text-sm text-red-500 text-center py-6">
              {error}
            </p>
          ) : visibleIncomes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <p className="text-sm text-slate-500">
                No income records yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleIncomes.map((income) => (
                <div
                  key={income.id}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {income.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(income.income_date)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-bold text-emerald-600 whitespace-nowrap">
                      +₹{formatAmount(income.amount)}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(income.id)}
                        aria-label={`Edit ${income.title}`}
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(income.id)}
                        aria-label={`Delete ${income.title}`}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

            {/* Fixed bottom navigation */}
    <div className="shrink-0 w-full border-t border-slate-200 bg-white">
      <BottomNav />
    </div>
    </div>
  );
};
