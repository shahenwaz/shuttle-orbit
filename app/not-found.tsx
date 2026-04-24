import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-primary">404</p>
      <h2 className="text-4xl font-bold tracking-tight">Page not found</h2>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or has not been created yet.
      </p>
      <Button asChild className="rounded-full px-6">
        <Link href="/">Go home</Link>
      </Button>
    </PageContainer>
  );
}
