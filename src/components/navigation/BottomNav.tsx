
"use client";

import React from "react";
import { motion } from "framer-motion";

import { useAppSelector } from "@/redux/hooks";
import { useScreenNavigation } from "@/hooks/useScreenNavigation";
import { canAccessScreen } from "@/lib/screenAccess";
import type { AppView } from "@/redux/features/navigation/navigationSlice";

import {
  LayoutDashboard,
  MinusCircle,
  PlusCircle,
  Sparkles,
  ReceiptText,
  ChartNoAxesCombined,
  UserRound,
  Settings,
} from "lucide-react";

type NavItem = {
  id: AppView;
  label: string;
  icon: React.ElementType;
  colorScheme?: "expense" | "income" | "ai" | "neutral";
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Home",
    icon: LayoutDashboard,
    colorScheme: "neutral",
  },
  {
    id: "add-expense",
    label: "Expense",
    icon: MinusCircle,
    colorScheme: "expense",
  },
  {
    id: "add-income",
    label: "Income",
    icon: PlusCircle,
    colorScheme: "income",
  },
  {
    id: "ask-question",
    label: "Ask AI",
    icon: Sparkles,
    colorScheme: "ai",
  },
  {
    id: "transactions",
    label: "History",
    icon: ReceiptText,
    colorScheme: "neutral",
  },
  {
    id: "reports",
    label: "Reports",
    icon: ChartNoAxesCombined,
    colorScheme: "neutral",
  },
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
    colorScheme: "neutral",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    colorScheme: "neutral",
  },
];

export const BottomNav: React.FC = () => {
  const { currentView, navigate } = useScreenNavigation();

  const { user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const allowedNavItems =
    isAuthenticated && user
      ? navItems.filter((item) =>
          canAccessScreen(user.roles, item.id)
        )
      : [];

  if (allowedNavItems.length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 safe-bottom shadow-nav">
      <div className="max-w-md mx-auto flex items-center gap-1 overflow-x-auto">
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          let activeColor = "text-brand-600 bg-brand-50";
          let iconColor = "text-brand-600";

          if (item.colorScheme === "expense") {
            activeColor = "text-rose-600 bg-rose-50";
            iconColor = "text-rose-600";
          } else if (item.colorScheme === "income") {
            activeColor = "text-emerald-600 bg-emerald-50";
            iconColor = "text-emerald-600";
          } else if (item.colorScheme === "ai") {
            activeColor = "text-indigo-600 bg-indigo-50";
            iconColor = "text-indigo-600";
          }

          return (
            <button
              key={item.id}
              type="button"
             onClick={() => {navigate(item.id);}}
              className="relative flex shrink-0 flex-col items-center justify-center py-2 px-3 min-w-[65px] transition-all group"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  className={`absolute inset-0 rounded-2xl ${activeColor} -z-10`}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? iconColor
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              />

              <span
                className={`text-[10px] font-semibold mt-1 leading-tight ${
                  isActive
                    ? iconColor
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
