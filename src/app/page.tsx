"use client";

import React, { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { restoreSession } from "@/redux/features/auth/authSlice";
import { setCurrentView } from "@/redux/features/navigation/navigationSlice";

import {
  canAccessScreen,
  getDefaultScreen,
} from "@/lib/screenAccess";

import { MobileShell } from "@/components/layout/MobileShell";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { LoginPage } from "@/components/auth/LoginPage";
import { RegisterPage } from "@/components/auth/RegisterPage";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AddExpenseForm } from "@/components/forms/AddExpenseForm";
import { AskQuestionChat } from "@/components/ai/AskQuestionChat";
import { TransactionHistory } from "@/components/screens/TransactionHistory";
import { ReportsScreen } from "@/components/screens/ReportsScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

import { AnimatePresence, motion } from "framer-motion";
import {AddIncomeForm} from "@/components/forms/AddIncomeForm";

export default function Home() {
  const dispatch = useAppDispatch();
  const restoreStarted = useRef(false);

  const currentView = useAppSelector(
    (state) => state.navigation.currentView
  );

  const { user, isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  );

  // Restore authentication after browser refresh.
  useEffect(() => {
    if (!initialized && !restoreStarted.current) {
      restoreStarted.current = true;
      dispatch(restoreSession());
    }
  }, [dispatch, initialized]);

  // Handle authentication and role-based navigation.
  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated || !user) {
      if (currentView !== "login" && currentView !== "register") {
        dispatch(setCurrentView("login"));
      }
      return;
    }

    if (!canAccessScreen(user.roles, currentView)) {
      dispatch(setCurrentView(getDefaultScreen(user.roles)));
    }
  }, [
    dispatch,
    initialized,
    isAuthenticated,
    user,
    currentView,
  ]);

  

const renderCurrentView = () => {
  switch (currentView) {
    case "splash":
      return <SplashScreen />;
    case "login":
      return <LoginPage />;
    case "register":
      return <RegisterPage />;
    case "dashboard":
      return <Dashboard />;
    case "add-expense":
      return <AddExpenseForm />;
    case "add-income":
       return <AddIncomeForm />;
    case "ask-question":
      return <AskQuestionChat />;
    case "transactions":
      return <TransactionHistory />;
    case "reports":
      return <ReportsScreen />;
    case "profile":
      return <ProfileScreen />;
    case "settings":
      return <SettingsScreen />;
    default:
      return <Dashboard />;
  }
};

return (

  <MobileShell>
    <div className="flex flex-col flex-1 w-full min-h-0 justify-start">
      {renderCurrentView()}
    </div>
  </MobileShell>

);
}