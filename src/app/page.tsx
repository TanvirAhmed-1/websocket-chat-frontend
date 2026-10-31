"use client";

import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/hook";
import { SidebarNav } from "@/components/chat/SidebarNav";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { SettingsView } from "@/components/settings/SettingsView";
import { UserProfileView } from "@/components/profile/UserProfileView";
import { ACCENT_COLORS } from "@/redux/features/theme/themeSlice";

export default function Home() {
  const activeNavTab = useAppSelector((state) => state.chat.activeNavTab);
  const themeMode = useAppSelector((state) => state.theme?.mode || "light");
  const accentColor = useAppSelector((state) => state.theme?.accent || "purple");

  // Keep theme & accent in sync
  useEffect(() => {
    const root = document.documentElement;

    if (themeMode === "dark") {
      root.classList.add("dark");
    } else if (themeMode === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    const currentAccent = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;
    root.style.setProperty("--primary", currentAccent.hex);
  }, [themeMode, accentColor]);

  return (
    <main className="h-screen w-screen p-3 sm:p-5 flex gap-3 sm:gap-4 overflow-hidden bg-[#EFF3F8] dark:bg-[#0B0F19] transition-colors">
      {/* 1. Left Purple Navigation Pill */}
      <SidebarNav />

      {/* 2. Main Content Based on Active Nav Tab */}
      {activeNavTab === "settings" ? (
        <SettingsView />
      ) : activeNavTab === "profile" ? (
        <div className="flex-1 bg-white dark:bg-[#151C2C] rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col h-full overflow-hidden">
          <UserProfileView />
        </div>
      ) : (
        <>
          {/* Middle Conversation List (Groups + People + Search) */}
          <ConversationSidebar />

          {/* Right Main Chat Area */}
          <ChatArea />
        </>
      )}
    </main>
  );
}
