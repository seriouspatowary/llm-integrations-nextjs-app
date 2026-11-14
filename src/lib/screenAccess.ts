import type { AppView } from "@/redux/features/navigation/navigationSlice";

export const getDefaultScreen = (roles: string[]): AppView => {
  if (roles.includes("SUPER_ADMIN")) return "dashboard";

  if (roles.includes("EXPENSE_USER")) return "dashboard";

  if (roles.includes("FAKE_NEWS_USER")) return "ask-question";

  return "dashboard";
};

export const canAccessScreen = (
  roles: string[],
  screen: AppView
): boolean => {
  if (roles.includes("SUPER_ADMIN")) return true;

  const expenseScreens: AppView[] = [
    "dashboard",
    "add-expense",
    "add-income",
    "reports",
    "profile",
    "settings",
  ];

  const ragScreens: AppView[] = [
    "ask-question",
    "profile",
    "settings",
  ];

  if (
    roles.includes("EXPENSE_USER") &&
    expenseScreens.includes(screen)
  ) {
    return true;
  }

  if (
    roles.includes("FAKE_NEWS_USER") &&
    ragScreens.includes(screen)
  ) {
    return true;
  }

  return false;
};