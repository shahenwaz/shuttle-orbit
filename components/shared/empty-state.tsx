type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-5 text-xs text-muted-foreground sm:text-sm">
      {message}
    </div>
  );
}
