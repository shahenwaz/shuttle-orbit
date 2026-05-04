import { cn } from "@/lib/utils";

type PlayerIdentityRowProps = {
  fullName: string;
  nickname: string;
  categoryCodes?: string[];
  className?: string;
  nameClassName?: string;
  nicknameClassName?: string;
  categoriesClassName?: string;
};

export function PlayerIdentityRow({
  fullName,
  nickname,
  categoryCodes,
  className,
  nameClassName,
  nicknameClassName,
  categoriesClassName,
}: PlayerIdentityRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate pr-1 text-[13px] font-bold uppercase tracking-[0.08em] text-purple-400 sm:text-sm",
            nameClassName,
          )}
        >
          {fullName}
          <span
            className={cn(
              "ml-2 font-medium normal-case tracking-normal text-muted-foreground",
              nicknameClassName,
            )}
          >
            - @{nickname}
          </span>
        </p>
      </div>

      {categoryCodes && categoryCodes.length > 0 ? (
        <span
          className={cn(
            "shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-primary/90",
            categoriesClassName,
          )}
        >
          {categoryCodes.join(" · ")}
        </span>
      ) : null}
    </div>
  );
}
