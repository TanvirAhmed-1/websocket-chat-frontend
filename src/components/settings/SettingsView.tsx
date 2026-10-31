"use client";

import React, { useState } from "react";
import {
  Palette,
  KeyRound,
  User,
  Bell,
  ArrowLeft,
  Sliders,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { setActiveNavTab } from "@/redux/features/chat/chatSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeSection } from "./ThemeSection";
import { ChangePasswordSection } from "./ChangePasswordSection";
import { UserProfileView } from "@/components/profile/UserProfileView";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const dispatch = useAppDispatch();
  const [activeSubTab, setActiveSubTab] = useState<
    "theme" | "password" | "profile" | "notifications"
  >("theme");

  const [messageSound, setMessageSound] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);

  const tabs = [
    { id: "theme" as const, label: "Theme & Styling", icon: Palette },
    { id: "password" as const, label: "Password & Security", icon: KeyRound },
    { id: "profile" as const, label: "Account Profile", icon: User },
    { id: "notifications" as const, label: "Preferences", icon: Bell },
  ];

  return (
    <div className="flex-1 bg-white dark:bg-[#151C2C] rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => dispatch(setActiveNavTab("chat"))}
            title="Back to chat"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Settings & Customization
            </h1>
            <p className="text-xs text-slate-400">
              Personalize your appearance, account security, and notification preferences
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => dispatch(setActiveNavTab("chat"))}
          className="rounded-xl text-xs gap-1.5 hidden sm:inline-flex"
        >
          Return to Chat
        </Button>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex items-center gap-2 py-4 border-b border-slate-100 dark:border-slate-800 overflow-x-auto shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
                isActive
                  ? "bg-[#6E00FF] text-white shadow-md shadow-[#6E00FF]/20"
                  : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto py-6 pr-1">
        {activeSubTab === "theme" && <ThemeSection />}

        {activeSubTab === "password" && <ChangePasswordSection />}

        {activeSubTab === "profile" && <UserProfileView />}

        {activeSubTab === "notifications" && (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151C2C]">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                Chat & Notification Preferences
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Control alert sounds, read receipts, and online activity indicators
              </p>

              <div className="flex flex-col gap-4 divide-y divide-slate-100 dark:divide-slate-800">
                {/* 1 */}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Message Chime & Audio
                    </h4>
                    <p className="text-xs text-slate-400">
                      Play audio alert sound when new messages arrive
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={messageSound}
                    onChange={(e) => setMessageSound(e.target.checked)}
                    className="w-5 h-5 accent-[#6E00FF] rounded cursor-pointer"
                  />
                </div>

                {/* 2 */}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Desktop Push Notifications
                    </h4>
                    <p className="text-xs text-slate-400">
                      Receive notifications when the window is in the background
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={desktopAlerts}
                    onChange={(e) => setDesktopAlerts(e.target.checked)}
                    className="w-5 h-5 accent-[#6E00FF] rounded cursor-pointer"
                  />
                </div>

                {/* 3 */}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Read Receipts (Double Blue/Purple Checks)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Let participants see when you have read their messages
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={readReceipts}
                    onChange={(e) => setReadReceipts(e.target.checked)}
                    className="w-5 h-5 accent-[#6E00FF] rounded cursor-pointer"
                  />
                </div>

                {/* 4 */}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Show Online Activity Indicator
                    </h4>
                    <p className="text-xs text-slate-400">
                      Show green status dot when active in conversations
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={onlineStatus}
                    onChange={(e) => setOnlineStatus(e.target.checked)}
                    className="w-5 h-5 accent-[#6E00FF] rounded cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

