
"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  MinusCircle,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createExpense,
  fetchExpenses,
  updateExpense,
  deleteExpense,
  type Expense,
} from "@/redux/features/expense/expenseSlice";
import { useScreenNavigation } from "@/hooks/useScreenNavigation";
import { BottomNav } from "../navigation/BottomNav";

export const AddExpenseForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { navigate } = useScreenNavigation();

  const {
    expenses,
    loading,
    submitting,
    deletingId,
    error,
  } = useAppSelector((state) => state.expense);

  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // List state
  const [showAll, setShowAll] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<Expense | null>(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const sortedExpenses = [...expenses].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  const visibleExpenses = showAll
    ? sortedExpenses
    : sortedExpenses.slice(0, 5);

  const formatAmount = (value: number | string) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (value?: string) => {
    if (!value) return "";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  // CREATE
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const parsedAmount = Number(amount);

    if (
      !title.trim() ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return;
    }

    try {
      await dispatch(
        createExpense({
          title: title.trim(),
          amount: parsedAmount,
          ...(description.trim()
            ? { description: description.trim() }
            : {}),
        })
      ).unwrap();

      setTitle("");
      setAmount("");
      setDescription("");

      await dispatch(fetchExpenses()).unwrap();
    } catch (err) {
      console.error("Create expense failed:", err);
    }
  };

  // UPDATE
  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingExpense) return;

    const parsedAmount = Number(amount);

    if (
      !title.trim() ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return;
    }

    try {
      await dispatch(
        updateExpense({
          id: editingExpense.id,
          data: {
            title: title.trim(),
            amount: parsedAmount,
            description: description.trim(),
          },
        })
      ).unwrap();

      setEditingExpense(null);
      setTitle("");
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Update expense failed:", err);
    }
  };

  const startEditing = (expense: Expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setDescription(expense.description ?? "");
  };

  const cancelEditing = () => {
    setEditingExpense(null);
    setTitle("");
    setAmount("");
    setDescription("");
  };

  // DELETE
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await dispatch(
        deleteExpense(deleteTarget.id)
      ).unwrap();

      if (editingExpense?.id === deleteTarget.id) {
        cancelEditing();
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete expense failed:", err);
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 min-h-0 bg-slate-50">

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
            Add Expense
          </h1>
          <p className="text-xs text-slate-400">
            Manage your expenses
          </p>
        </div>

        <div className="w-10" />
      </header>

      {/* Scrollable content */}
      <main className="flex-1 min-h-0 overflow-y-auto px-5 pt-6 pb-8 space-y-8">

        {/* Expense Form */}
        <form
          onSubmit={
            editingExpense ? handleUpdate : handleSubmit
          }
          className="space-y-5"
        >
          {editingExpense && (
            <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
              <p className="text-sm font-semibold text-blue-700">
                Editing Expense
              </p>

              <button
                type="button"
                onClick={cancelEditing}
                className="text-blue-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="expense-title"
              className="block text-sm font-semibold text-slate-700"
            >
              Expense Title
            </label>

            <input
              id="expense-title"
              type="text"
              placeholder="e.g. Dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={150}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label
              htmlFor="expense-amount"
              className="block text-sm font-semibold text-slate-700"
            >
              Amount (₹)
            </label>

            <input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Optional Description */}
          <div className="space-y-2">
            <label
              htmlFor="expense-description"
              className="block text-sm font-semibold text-slate-700"
            >
              Description
              <span className="ml-1 text-xs font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <textarea
              id="expense-description"
              rows={3}
              placeholder="e.g. Lunch with colleagues"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <MinusCircle className="w-5 h-5" />
                {editingExpense
                  ? "Update Expense"
                  : "Save Expense"}
              </>
            )}
          </button>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </form>

        {/* Recent Expenses */}
        <section className="space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Expenses
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {expenses.length} transactions
              </p>
            </div>

            {expenses.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1 text-sm font-semibold text-rose-600"
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

          {loading && expenses.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
            </div>
          ) : error && expenses.length === 0 ? (
            <p className="text-sm text-red-600 text-center py-6">
              {error}
            </p>
          ) : visibleExpenses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <p className="text-sm text-slate-500">
                No expense records yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-rose-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {expense.title}
                    </h3>

                    {expense.description && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {expense.description}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(
                        expense.expense_date ||
                        expense.created_at
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-bold text-rose-600 whitespace-nowrap">
                      -₹{formatAmount(expense.amount)}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEditing(expense)}
                        aria-label={`Edit ${expense.title}`}
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(expense)}
                        aria-label={`Delete ${expense.title}`}
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

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-expense-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl space-y-4"
          >
            <h3
              id="delete-expense-title"
              className="text-lg font-bold text-slate-900"
            >
              Delete Expense?
            </h3>

            <p className="text-sm text-slate-500">
              Are you sure you want to delete
              {" "}<strong>{deleteTarget.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId !== null}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deletingId
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
