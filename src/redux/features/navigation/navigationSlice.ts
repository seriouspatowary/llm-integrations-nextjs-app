import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppView =
  | "splash"
  | "login"
  | "register"
  | "dashboard"
  | "add-expense"
  | "add-income"
  | "ask-question"
  | "transactions"
  | "reports"
  | "profile"
  | "settings";

interface NavigationState {
  currentView: AppView;
}

const initialState: NavigationState = {
  currentView: "splash",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<AppView>) => {
      state.currentView = action.payload;
    },
  },
});

export const { setCurrentView } = navigationSlice.actions;
export default navigationSlice.reducer;