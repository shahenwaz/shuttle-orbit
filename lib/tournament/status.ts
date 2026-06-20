export type TournamentDisplayStatusKey = "upcoming" | "live" | "completed";

export type TournamentDisplayStatus = {
  key: TournamentDisplayStatusKey;
  label: string;
  accent: "info" | "warning" | "success";
};

function getDateKey(value: Date | string | number, timeZone = "Europe/Dublin") {
  const date = new Date(value);

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function getTournamentDisplayStatus(
  eventDate: Date | string | number,
  now: Date = new Date(),
): TournamentDisplayStatus {
  const eventDateKey = getDateKey(eventDate);
  const todayKey = getDateKey(now);

  if (eventDateKey > todayKey) {
    return {
      key: "upcoming",
      label: "Upcoming",
      accent: "info",
    };
  }

  if (eventDateKey === todayKey) {
    return {
      key: "live",
      label: "Live Today",
      accent: "warning",
    };
  }

  return {
    key: "completed",
    label: "Completed",
    accent: "success",
  };
}
