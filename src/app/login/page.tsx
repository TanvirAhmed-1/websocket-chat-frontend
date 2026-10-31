import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Live Chat",
  description: "Sign in to your Live Chat account to connect and message in real-time.",
};

export default function LoginPage() {
  return <LoginForm />;
}

