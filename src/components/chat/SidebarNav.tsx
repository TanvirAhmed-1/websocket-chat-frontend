"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, MessageSquare, Bell, Settings, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setActiveNavTab } from "@/redux/features/chat/chatSlice";
import { logout } from "@/redux/features/auth/authSlice";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const SidebarNav: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.chat.activeNavTab);
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "chat" as const, icon: MessageSquare, label: "Chat" },
    { id: "notifications" as const, icon: Bell, label: "Notifications" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
  ];

  const displayName = mounted && user?.name ? user.name : "Profile";
  const avatarSrc = mounted && user?.avatarUrl ? user.avatarUrl : undefined;

  return (
    <aside className="relative flex flex-col items-center justify-between w-18 sm:w-20 bg-[#6E00FF] py-6 rounded-[2.5rem] shadow-xl select-none shrink-0 h-full">
      {/* Top Profile Avatar */}
      <div className="flex flex-col items-center pt-2">
        <button
          onClick={() => dispatch(setActiveNavTab("profile"))}
          className={cn(
            "relative transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer rounded-full p-0.5",
            activeTab === "profile"
              ? "ring-4 ring-white shadow-lg"
              : "ring-2 ring-white/40"
          )}
          title={`${displayName} - Click to edit profile`}
          suppressHydrationWarning
        >
          <Avatar
            src={avatarSrc}
            alt={displayName}
            fallback={user?.name ? user.name.slice(0, 2).toUpperCase() : "U"}
            size="lg"
            className="h-12 w-12 border-2 border-white/80"
          />
          {activeTab === "profile" && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-[#6E00FF] flex items-center justify-center text-[10px] font-bold shadow-sm">
              <User className="w-2.5 h-2.5" />
            </span>
          )}
        </button>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col items-center gap-6 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="relative w-full flex justify-center">
              <button
                onClick={() => dispatch(setActiveNavTab(item.id))}
                aria-label={item.label}
                className={cn(
                  "p-3 rounded-2xl transition-all duration-200 flex items-center justify-center cursor-pointer",
                  isActive
                    ? "text-white scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all stroke-[2.2]",
                    isActive && "stroke-[2.6]"
                  )}
                />
              </button>

              {/* White active pill indicator on the right edge */}
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-l-full shadow-sm" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Logout Button */}
      <div className="flex flex-col items-center pb-2">
        <button
          onClick={async () => {
            if (typeof document !== "undefined") {
              document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
            try {
              await removeTokenCookie();
            } catch {
              // ignore
            }
            dispatch(logout());
            toast.success("Logged out successfully");
            window.location.href = "/login";
          }}
          title="Sign out / Switch account"
          aria-label="Sign out"
          className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all cursor-pointer"
        >
          <LogOut className="w-6 h-6 stroke-[2.2] rotate-180" />
        </button>
      </div>
    </aside>
  );
};
