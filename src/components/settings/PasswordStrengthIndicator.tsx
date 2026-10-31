"use client";

import React from "react";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PasswordStrengthIndicatorProps {
  newPassword: string;
  confirmPassword: string;
}

export function PasswordStrengthIndicator({
  newPassword,
  confirmPassword,
}: PasswordStrengthIndicatorProps) {
  const checks = [
    {
      label: "Minimum 6 characters length",
      passed: newPassword.length >= 6,
    },
    {
      label: "Contains uppercase & lowercase letters",
      passed: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    },
    {
      label: "Contains at least one number or symbol",
      passed: /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    },
    {
      label: "Confirmation password matches",
      passed:
        newPassword.length >= 6 &&
        confirmPassword.length > 0 &&
        newPassword === confirmPassword,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const strengthLabels = ["Unset", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-slate-200 dark:bg-slate-700",
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 bg-white dark:bg-[#151C2C]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/60 text-[#6E00FF]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wide text-slate-900 dark:text-slate-100 uppercase">
              Password Security Checklist
            </h3>
            <p className="text-[11px] text-slate-400">
              Live verification as you type
            </p>
          </div>
        </div>
        <Badge
          variant={passedCount >= 3 ? "success" : "secondary"}
          className="font-mono text-[10px]"
        >
          {strengthLabels[passedCount]}
        </Badge>
      </div>

      {/* 4-segment strength bar */}
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              passedCount >= step
                ? strengthColors[passedCount]
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          />
        ))}
      </div>

      {/* Checklist items */}
      <ul className="mt-4 space-y-2">
        {checks.map((check) => (
          <li
            key={check.label}
            className="flex items-center gap-2 text-xs font-medium"
          >
            {check.passed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
            <span
              className={
                check.passed
                  ? "text-slate-800 dark:text-slate-200 font-semibold"
                  : "text-slate-400 dark:text-slate-500"
              }
            >
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

