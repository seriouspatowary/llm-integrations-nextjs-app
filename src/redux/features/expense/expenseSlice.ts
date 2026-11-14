
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import type { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Expense returned by backend
export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number | string;
  description: string | null;
  expense_date: string;
  created_at: string;
}

// Only title and amount required
export interface CreateExpensePayload {
  title: string;
  amount: number;
  description?: string;
}

export interface UpdateExpensePayload {
  id: string;
  data: Partial<CreateExpensePayload>;
}

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  submitting: boolean;
  deletingId: string | null;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  submitting: false,
  deletingId: null,
  error: null,
};

// Common API helper
async function expenseRequest(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...options.headers,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Expense API request failed"
    );
  }

  return data;
}

// CREATE EXPENSE
export const createExpense = createAsyncThunk<
  Expense,
  CreateExpensePayload,
  { state: RootState; rejectValue: string }
>(
  "expense/create",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;

      const data = await expenseRequest(
        "/api/expenses",
        token,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      return data.expense;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to create expense"
      );
    }
  }
);

// FETCH LOGGED-IN USER'S EXPENSES
export const fetchExpenses = createAsyncThunk<
  Expense[],
  void,
  { state: RootState; rejectValue: string }
>(
  "expense/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;

      const data = await expenseRequest(
        "/api/expenses",
        token,
        {
          method: "GET",
        }
      );

      return data.expenses;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch expenses"
      );
    }
  }
);

// UPDATE EXPENSE
export const updateExpense = createAsyncThunk<
  Expense,
  UpdateExpensePayload,
  { state: RootState; rejectValue: string }
>(
  "expense/update",
  async (
    { id, data },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getState().auth.accessToken;

      const result = await expenseRequest(
        `/api/expenses/${id}`,
        token,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );

      return result.expense;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update expense"
      );
    }
  }
);

// DELETE EXPENSE
export const deleteExpense = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  "expense/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;

      await expenseRequest(
        `/api/expenses/${id}`,
        token,
        {
          method: "DELETE",
        }
      );

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to delete expense"
      );
    }
  }
);

// REDUX SLICE
const expenseSlice = createSlice({
  name: "expense",
  initialState,

  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    },

    clearExpenses: (state) => {
      state.expenses = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch expenses";
      })

      // CREATE
      .addCase(createExpense.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.submitting = false;
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload || "Failed to create expense";
      })

      // UPDATE
      .addCase(updateExpense.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.submitting = false;

        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id
        );

        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload || "Failed to update expense";
      })

      // DELETE
      .addCase(deleteExpense.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deletingId = null;
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deletingId = null;
        state.error =
          action.payload || "Failed to delete expense";
      });
  },
});

export const {
  clearExpenseError,
  clearExpenses,
} = expenseSlice.actions;

export default expenseSlice.reducer;
