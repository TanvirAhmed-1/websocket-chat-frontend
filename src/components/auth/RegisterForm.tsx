"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hook";
import { setCredentials } from "@/redux/features/auth/authSlice";
import {
  useRegisterMutation,
  useLoginMutation,
} from "@/redux/features/auth/authApi";
import { setTokenCookie } from "@/redux/server/storeCookies";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser] = useRegisterMutation();
  const [loginUser] = useLoginMutation();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Strength check
  const isLengthValid = password.length >= 6;
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9!@#$%^&*]/.test(password);
  const isMatch = password.length >= 6 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please accept the Terms of Service to continue");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      }).unwrap();

      let token =
        res?.data?.accessToken ||
        res?.accessToken ||
        res?.data?.token ||
        res?.token ||
        res?.result?.token;

      let user = res?.data?.user || res?.user || res?.result?.user;

      // If backend registration didn't return a token, auto-login immediately
      if (!token) {
        try {
          const loginRes = await loginUser({
            email: email.trim(),
            password: password.trim(),
          }).unwrap();

          token =
            loginRes?.data?.accessToken ||
            loginRes?.accessToken ||
            loginRes?.data?.token ||
            loginRes?.token ||
            loginRes?.result?.token;

          user = loginRes?.data?.user || loginRes?.user || user;
        } catch {
          // auto-login fallback
        }
      }

      if (token) {
        await setTokenCookie(token);
        const resolvedUser = user || {
          id: res?.data?.id || `user-${Date.now()}`,
          name: name.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim(),
          phone: phone.trim(),
          role: "USER",
        };
        dispatch(setCredentials({ user: resolvedUser, token }));
      }

      toast.success("Account created! You are now logged in.", {
        icon: "🎉",
      });
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Registration failed. Please check your information.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EFF3F8] dark:bg-[#0B0F19] p-4 sm:p-6 transition-colors">
      {/* Background decorations */}
      <div className="fixed top-12 left-1/4 w-96 h-96 bg-[#6E00FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-12 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-5xl rounded-[2.5rem] bg-white dark:bg-[#151C2C] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        {/* Left Column: Brand & Security Showcase */}
        <div className="hidden md:flex md:w-[46%] bg-gradient-to-br from-[#6E00FF] via-[#5b00d6] to-[#430099] p-8 lg:p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
              <MessageSquare className="w-6 h-6 text-white stroke-[2.4]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">
                Live<span className="text-purple-200">Chat</span>
              </span>
              <p className="text-[11px] text-purple-200/80 font-medium">
                Create Your Profile
              </p>
            </div>
          </div>

          {/* Center Content */}
          <div className="my-auto py-6 z-10 flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
                Join thousands chatting in realtime.
              </h2>
              <p className="text-xs text-purple-100/80 mt-2 leading-relaxed">
                Connect with team members, participate in group discussions, and
                enjoy end-to-end encrypted messaging.
              </p>
            </div>

            {/* Checklist */}
            <div className="flex flex-col gap-3 text-xs text-purple-100/90 pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Unlimited group & direct conversations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-200 shrink-0" />
                <span>Enterprise grade SSL & bcrypt hash encryption</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-pink-300 shrink-0" />
                <span>Custom themes, avatars and media uploads</span>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="z-10 pt-4 border-t border-white/15">
            <p className="text-[11px] text-purple-200/70">
              © 2026 LiveChat Inc. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E00FF] bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                Get Started
              </span>
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-500 hover:text-[#6E00FF] transition-colors"
              >
                Already have an account?{" "}
                <span className="text-[#6E00FF] underline">Sign In</span>
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Create an account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Set up your chat profile to get started in seconds
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="my-5 flex flex-col gap-3.5">
            {/* Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-slate-400" /> Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="unique_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+880 1..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Confirm <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 px-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick mini validation pills */}
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${isLengthValid ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-slate-100 text-slate-400"}`}>
                <CheckCircle2 className="w-3 h-3" /> 6+ chars
              </span>
              <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${hasLetters ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-slate-100 text-slate-400"}`}>
                <CheckCircle2 className="w-3 h-3" /> Letters
              </span>
              <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${hasNumbers ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-slate-100 text-slate-400"}`}>
                <CheckCircle2 className="w-3 h-3" /> Numbers/Symbols
              </span>
              <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${isMatch ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-slate-100 text-slate-400"}`}>
                <CheckCircle2 className="w-3 h-3" /> Match
              </span>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6E00FF] cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                I agree to the <span className="text-[#6E00FF] underline">Terms of Service</span> and <span className="text-[#6E00FF] underline">Privacy Policy</span>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#6E00FF] hover:bg-[#5b00d6] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#6E00FF]/25 gap-2 cursor-pointer mt-1"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4 stroke-[2.4]" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#6E00FF] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
