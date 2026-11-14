
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

// ================================
// Types
// ================================

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions?: string[];
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RefreshResponse {
  accessToken: string;
  user?: User;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: "EXPENSE_USER" | "FAKE_NEWS_USER";
}

interface RegisterResponse {
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ================================
// Initial State
// ================================

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

// ================================
// Helpers
// ================================

const getErrorMessage = async (
  response: Response
): Promise<string> => {
  try {
    const data = await response.json();
    return data.message || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

// ================================
// 1. Login
// ================================

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response)
        );
      }

      return (await response.json()) as LoginResponse;
    } catch {
      return rejectWithValue(
        "Unable to connect to authentication server"
      );
    }
  }
);



// ================================
// 2. Register User
// ================================

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Registration failed"
        );
      }

      return data;
    } catch {
      return rejectWithValue(
        "Unable to connect to the server"
      );
    }
  }
);

// ================================
// 3. Refresh Access Token
// ================================

export const refreshAccessToken = createAsyncThunk<
  RefreshResponse,
  void,
  { rejectValue: string }
>(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response)
        );
      }

      return (await response.json()) as RefreshResponse;
    } catch {
      return rejectWithValue("Session refresh failed");
    }
  }
);

// ================================
// 4. Fetch Current User
// ================================

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>(
  "auth/me",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;

      if (!token) {
        return rejectWithValue("Access token missing");
      }

      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response)
        );
      }

      const data = await response.json();

      // Assumes /me returns { user: {...} }
      return data.user as User;
    } catch {
      return rejectWithValue("Unable to fetch user");
    }
  }
);

// ================================
// 4. Restore Session
// ================================

export const restoreSession = createAsyncThunk<
  { accessToken: string; user: User },
  void,
  { rejectValue: string }
>(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const refreshResponse = await fetch(
        `${API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!refreshResponse.ok) {
        return rejectWithValue("Session expired");
      }

      const refreshData =
        (await refreshResponse.json()) as RefreshResponse;

      if (!refreshData.accessToken) {
        return rejectWithValue("Access token missing");
      }

      if (refreshData.user) {
        return {
          accessToken: refreshData.accessToken,
          user: refreshData.user,
        };
      }

      const meResponse = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${refreshData.accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!meResponse.ok) {
        return rejectWithValue("Unable to restore user");
      }

      const data = await meResponse.json();

      return {
        accessToken: refreshData.accessToken,
        user: data.user as User,
      };
    } catch {
      return rejectWithValue("Session restoration failed");
    }
  }
);

// ================================
// 5. Logout
// ================================

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response)
        );
      }
    } catch {
      return rejectWithValue("Logout request failed");
    }
  }
);

// ================================
// Auth Slice
// ================================

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.initialized = true;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    setAccessToken: (
      state,
      action: PayloadAction<string>
    ) => {
      state.accessToken = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.initialized = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })

      // REFRESH TOKEN
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;

        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })

      // CURRENT USER
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      // RESTORE SESSION
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.initialized = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload ?? "Logout failed";
      })

      // registerUser
       .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
        })
  },
});

export const {
  clearAuth,
  clearAuthError,
  setAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
