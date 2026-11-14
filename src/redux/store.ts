import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import navigationReducer from "./features/navigation/navigationSlice";
import incomeReducer from "./features/income/incomeSlice";
import expenseReducer from "./features/expense/expenseSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      navigation: navigationReducer,
      income: incomeReducer,
      expense: expenseReducer,

    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];