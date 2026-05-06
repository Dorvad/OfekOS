export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}

export function formatProgress(value: number): string {
  return `${Math.round(value)}%`;
}
