
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import type { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Income returned by backend
export interface Income {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category?: string | null;
  description?: string | null;
  income_date: string;
  created_at: string;
}

// Only title and amount are required from frontend
export interface CreateIncomePayload {
  title: string;
  amount: number;
}

interface IncomeState {
  incomes: Income[];
  loading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
  incomes: [],
  loading: false,
  error: null,
};

// CREATE INCOME
export const createIncome = createAsyncThunk<
  Income,
  CreateIncomePayload,
  { state: RootState; rejectValue: string }
>(
  "income/createIncome",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;

      const response = await fetch(`${API_URL}/api/expenses/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to create income"
        );
      }

      // Assumes backend returns { income: {...} }
      return data.income;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }
);

// FETCH ALL INCOMES
export const fetchIncomes = createAsyncThunk<
  Income[],
  void,
  { state: RootState; rejectValue: string }
>(
  "income/fetchIncomes",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;

      const response = await fetch(`${API_URL}/api/expenses/income`, {
        method: "GET",
        headers: {
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch incomes"
        );
      }

      // Assumes backend returns { incomes: [...] }
      return data.incomes;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }
);

const incomeSlice = createSlice({
  name: "income",
  initialState,

  reducers: {
    clearIncomeError: (state) => {
      state.error = null;
    },

    clearIncomes: (state) => {
      state.incomes = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes.unshift(action.payload);
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to create income";
      })

      // FETCH
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch incomes";
      });
  },
});

export const {
  clearIncomeError,
  clearIncomes,
} = incomeSlice.actions;

export default incomeSlice.reducer;
