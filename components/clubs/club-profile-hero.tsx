import Image from "next/image";

type ClubProfileHeroProps = {
  club: {
    name: string;
    shortName: string | null;
    logoUrl: string | null;
  };
};

function getClubInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ClubProfileHero({ club }: ClubProfileHeroProps) {
  return (
    <section className="border-b border-white/10 pb-5">
      <div className="flex items-center gap-4">
        {club.logoUrl ? (
          <Image
            src={club.logoUrl}
            alt={`${club.name} logo`}
            width={88}
            height={88}
            priority
            className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center text-lg font-bold text-primary sm:h-20 sm:w-20 sm:text-xl">
            {getClubInitials(club.shortName ?? club.name)}
          </div>
        )}

        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">
            Club profile
          </p>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            {club.name}
          </h1>
        </div>
      </div>
    </section>
  );
}
