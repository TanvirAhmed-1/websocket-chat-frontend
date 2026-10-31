"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hook";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setTokenCookie } from "@/redux/server/storeCookies";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser({
        email: email.trim(),
        password: password.trim(),
      }).unwrap();

      const token =
        res?.token || res?.result?.token || res?.accessToken;
      if (token) {
        await setTokenCookie(token);
      }

      const user = res?.user || res?.result?.user || res?.data?.user;
      if (user && token) {
        dispatch(setCredentials({ user, token }));
      }

      toast.success(res?.message || "Welcome back! Login successful.", {
        icon: "🎉",
      });
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Invalid email or password";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EFF3F8] dark:bg-[#0B0F19] p-4 sm:p-6 transition-colors">
      {/* Background glowing decorations */}
      <div className="fixed top-12 left-1/4 w-96 h-96 bg-[#6E00FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-12 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-5xl rounded-[2.5rem] bg-white dark:bg-[#151C2C] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Column: Brand & Interactive Showcase */}
        <div className="hidden md:flex md:w-[48%] bg-gradient-to-br from-[#6E00FF] via-[#5b00d6] to-[#430099] p-8 lg:p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle pattern dots */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          {/* Top Logo */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
              <MessageSquare className="w-6 h-6 text-white stroke-[2.4]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">
                Live<span className="text-purple-200">Chat</span>
              </span>
              <p className="text-[11px] text-purple-200/80 font-medium">
                Real-Time WebSocket Messaging
              </p>
            </div>
          </div>

          {/* Center Features */}
          <div className="my-auto py-6 z-10 flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
                Connect and collaborate instantly.
              </h2>
              <p className="text-xs text-purple-100/80 mt-2 leading-relaxed">
                Experience high-performance live communication with instant typing indicators,
                read receipts, and media sharing.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-purple-100/90 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Instant WebSocket Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-200 shrink-0" />
                <span>End-to-End SSL Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Modern High-Speed Redux Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-300 shrink-0" />
                <span>Custom Dark & Light Theme System</span>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="z-10 pt-4 border-t border-white/15">
            <p className="text-[11px] text-purple-200/70">
              © 2026 LiveChat Inc. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E00FF] bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                Welcome Back
              </span>
              <Link
                href="/register"
                className="text-xs font-semibold text-slate-500 hover:text-[#6E00FF] transition-colors"
              >
                Need an account?{" "}
                <span className="text-[#6E00FF] underline">Register</span>
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enter your credentials to access your conversations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="my-6 flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6E00FF] cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none"
              >
                Remember this device for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#6E00FF] hover:bg-[#5b00d6] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#6E00FF]/25 gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 stroke-[2.4]" />
                </>
              )}
            </Button>
          </form>

          {/* Bottom Switcher */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-bold text-[#6E00FF] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
