import { cn } from "@/lib/utils";

type SectionIntroProps = {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionIntro({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: SectionIntroProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h2
        className={cn(
          "text-base font-semibold tracking-tight sm:text-lg",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
