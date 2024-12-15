import { parseISO, formatDistanceToNow } from "date-fns";

export const getNoteExpiryStatusMessage = (expiresAt) => {
  const messagePrefix = "This note will self destroy";

  if (!expiresAt) {
    return `${messagePrefix} as soon as its opened`;
  } else {
    const date = parseISO(expiresAt);
    return `${messagePrefix} ${formatDistanceToNow(date, {
      addSuffix: true,
    })}`;
  }
};
