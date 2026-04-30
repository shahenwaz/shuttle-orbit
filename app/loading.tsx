import { PageContainer } from "@/components/layout/page-container";

export default function GlobalLoading() {
  return (
    <PageContainer className="flex min-h-[60vh] items-center justify-center py-10">
      <div className="w-full max-w-xl rounded-md border border-white/10 bg-white/4 p-6 sm:p-7">
        <div className="space-y-4">
          <div className="h-4 w-28 animate-pulse rounded-md bg-white/10" />
          <div className="h-8 w-56 animate-pulse rounded-md bg-white/10" />
          <div className="space-y-2 pt-1">
            <div className="h-4 w-full animate-pulse rounded-md bg-white/8" />
            <div className="h-4 w-[88%] animate-pulse rounded-md bg-white/8" />
            <div className="h-4 w-[72%] animate-pulse rounded-md bg-white/8" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
