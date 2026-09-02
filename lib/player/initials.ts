export function getPlayerInitials(fullName: string, nickname: string | null) {
  const trimmedNickname = nickname?.trim();

  if (trimmedNickname) {
    const nicknameParts = trimmedNickname.split(/[\s_-]+/u).filter(Boolean);

    if (nicknameParts.length > 1) {
      return `${nicknameParts[0][0]}${nicknameParts[1][0]}`.toUpperCase();
    }

    return Array.from(nicknameParts[0]).slice(0, 2).join("").toUpperCase();
  }

  const nameParts = fullName.trim().split(/\s+/u).filter(Boolean);

  if (nameParts.length > 0) {
    return nameParts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return "•";
}
