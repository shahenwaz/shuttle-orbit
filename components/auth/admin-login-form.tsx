"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { surfaceCardClassName } from "@/components/shared/surface-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  return (
    <PageContainer className="flex min-h-[72vh] items-center justify-center py-8 sm:min-h-[78vh] sm:py-10">
      <div
        className={surfaceCardClassName({
          variant: "elevated",
          className:
            "w-full max-w-md p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6",
        })}
      >
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-primary">
              <LockKeyhole className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Admin access
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Sign in
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Sign in to access the tournament admin workspace.
              </p>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setErrorMessage("");
              setIsPending(true);

              const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
              });

              setIsPending(false);

              if (result?.error) {
                setErrorMessage("Invalid email or password.");
                return;
              }

              router.push(callbackUrl);
              router.refresh();
            }}
          >
            <div className="space-y-3">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={cn(
                    "flex h-11 w-full rounded-md border border-white/10 bg-background/70 pl-10 pr-4 text-sm text-foreground outline-none transition",
                    "placeholder:text-muted-foreground/70",
                    "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/15",
                  )}
                  placeholder="admin@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={cn(
                  "flex h-11 w-full rounded-md border border-white/10 bg-background/70 px-4 text-sm text-foreground outline-none transition",
                  "placeholder:text-muted-foreground/70",
                  "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/15",
                )}
                placeholder="Enter password"
                required
              />
            </div>

            {errorMessage ? (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errorMessage}
              </div>
            ) : null}

            <Button type="submit" disabled={isPending} className="h-11 w-full">
              {isPending ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
