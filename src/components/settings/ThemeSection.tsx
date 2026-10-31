"use client";

import React, { useEffect } from "react";
import { Sun, Moon, Laptop, Check, Palette, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  setThemeMode,
  setAccentColor,
  TThemeMode,
  TAccentColor,
  ACCENT_COLORS,
} from "@/redux/features/theme/themeSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function ThemeSection() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme?.mode || "light");
  const accentColor = useAppSelector(
    (state) => state.theme?.accent || "purple"
  );

  // Apply changes to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply dark / light mode
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else if (themeMode === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // Apply primary color variable
    const selectedAccent = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;
    root.style.setProperty("--primary", selectedAccent.hex);
  }, [themeMode, accentColor]);

  const handleSelectMode = (mode: TThemeMode) => {
    dispatch(setThemeMode(mode));
    toast.success(
      `Theme set to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`,
      { duration: 2000 }
    );
  };

  const handleSelectAccent = (accent: TAccentColor) => {
    dispatch(setAccentColor(accent));
    toast.success(`Accent color changed to ${ACCENT_COLORS[accent].name}`, {
      duration: 2000,
    });
  };

  const modeOptions: {
    id: TThemeMode;
    label: string;
    desc: string;
    icon: React.ElementType;
    previewBg: string;
  }[] = [
    {
      id: "light",
      label: "Light Mode",
      desc: "Clean, bright interface designed for day-time clarity",
      icon: Sun,
      previewBg: "bg-[#EFF3F8] border-slate-200",
    },
    {
      id: "dark",
      label: "Dark Mode",
      desc: "Sleek, low-glare aesthetic for focused nighttime conversations",
      icon: Moon,
      previewBg: "bg-[#0B0F19] border-slate-800 text-white",
    },
    {
      id: "system",
      label: "System Sync",
      desc: "Automatically adapts based on your operating system preferences",
      icon: Laptop,
      previewBg:
        "bg-gradient-to-r from-[#EFF3F8] to-[#0B0F19] border-slate-300",
    },
  ];

  const currentAccent = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Theme Mode Cards */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            Appearance Mode
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Choose how Live Chat looks on your device
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {modeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = themeMode === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectMode(opt.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group",
                  isSelected
                    ? "border-[var(--primary)] bg-purple-50/20 dark:bg-purple-950/20 shadow-md"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151C2C] hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                {/* Active check pill */}
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                {/* Mockup Preview illustration */}
                <div
                  className={cn(
                    "w-full h-24 rounded-xl border p-2.5 mb-3 flex flex-col gap-1.5 overflow-hidden",
                    opt.previewBg
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="w-3/4 h-2 rounded-full bg-slate-300/60 dark:bg-slate-700 mt-1" />
                  <div className="flex justify-end mt-auto">
                    <div className="w-12 h-3 rounded-full bg-[var(--primary)]" />
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {opt.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  {opt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Color Accent Picker */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            Accent Color
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Personalize navigation, buttons, and message highlights
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {(Object.keys(ACCENT_COLORS) as TAccentColor[]).map((key) => {
            const color = ACCENT_COLORS[key];
            const isSelected = accentColor === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectAccent(key)}
                className={cn(
                  "p-3 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer text-left select-none",
                  isSelected
                    ? "border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-800/80 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151C2C] hover:border-slate-300"
                )}
              >
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Live Preview Card */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Live Interactive Theme Preview
        </h4>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#151C2C] shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: currentAccent.hex }}
            >
              TA
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Live Chat Demo
              </p>
              <div
                className="mt-1 px-3 py-1.5 rounded-2xl text-xs text-white inline-block shadow-xs"
                style={{ backgroundColor: currentAccent.hex }}
              >
                This is how your sent messages look!
              </div>
            </div>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            style={{ backgroundColor: currentAccent.hex }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
}

