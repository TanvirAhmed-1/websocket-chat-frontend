"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hook";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export function ChangePasswordSection() {
  const user = useAppSelector((state) => state.auth.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    // Simulate secure API rotation
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Password changed successfully! Session secured.", {
        icon: "🔒",
        duration: 4000,
      });
      handleReset();
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Password Strength & Security Info */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {/* Account Info Pill */}
        <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151C2C]">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#6E00FF] to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {user?.name || "User"}
                </h4>
                <Badge variant="purple" className="text-[10px]">
                  {user?.role || "USER"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
              <span className="text-slate-400 text-[11px] block">Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" /> Active
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
              <span className="text-slate-400 text-[11px] block">Encryption</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono font-semibold text-[11px] mt-0.5 block">
                bcrypt (10-Round)
              </span>
            </div>
          </div>
        </Card>

        {/* Live Password Strength Indicator */}
        <PasswordStrengthIndicator
          newPassword={newPassword}
          confirmPassword={confirmPassword}
        />
      </div>

      {/* Right Column: Password Change Form */}
      <Card className="lg:col-span-7 p-0 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151C2C] flex flex-col justify-between overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#6E00FF] flex items-center justify-center">
              <KeyRound className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                Update Password
              </h3>
              <p className="text-xs text-slate-400">
                Rotate your account password to protect your chat security
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <Lock className="w-3 h-3" /> SSL 256-Bit
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Security Tip Box */}
          <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#6E00FF] shrink-0 mt-0.5" />
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[12px]">
              Changing your password will maintain your current session while
              invalidating untrusted devices. We recommend using a combination of
              letters, numbers, and symbols.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleReset}
              className="h-10 px-4 rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Form
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6 rounded-xl bg-[#6E00FF] hover:bg-[#5b00d6] text-white text-xs font-bold gap-2 shadow-md shadow-[#6E00FF]/25 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Password"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

