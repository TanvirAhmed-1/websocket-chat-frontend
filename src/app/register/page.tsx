import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Live Chat",
  description: "Join Live Chat today to message and share in real-time.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

