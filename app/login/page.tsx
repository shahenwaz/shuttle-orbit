import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to access the Shuttle Orbit admin workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
