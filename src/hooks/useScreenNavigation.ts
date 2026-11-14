
"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  setCurrentView,
  type AppView,
} from "@/redux/features/navigation/navigationSlice";

import { canAccessScreen } from "@/lib/screenAccess";

export const useScreenNavigation = () => {
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  );

  const currentView = useAppSelector(
    (state) => state.navigation.currentView
  );

  const navigate = (screen: AppView) => {
    // Prevent navigation while restoring authentication
    if (!initialized) return;

    // Allow public screens only for unauthenticated users
    if (screen === "login" || screen === "register") {
      if (!isAuthenticated) {
        dispatch(setCurrentView(screen));
      }
      return;
    }

    if (!isAuthenticated || !user) {
      dispatch(setCurrentView("login"));
      return;
    }

    // Check role-based screen access
    if (!canAccessScreen(user.roles, screen)) {
      console.warn("Access denied:", screen);
      return;
    }

    dispatch(setCurrentView(screen));
  };

  return {
    currentView,
    navigate,
  };
};
