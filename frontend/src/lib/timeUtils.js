export function formatTimeDisplay(days, hours, minutes) {
  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
  return parts.join(" ") || "0 minutes";
}

export function convertToMinutes(days, hours, minutes) {
  return days * 24 * 60 + hours * 60 + minutes;
}

export function convertMinutesToTimeParts(totalMinutes) {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}
