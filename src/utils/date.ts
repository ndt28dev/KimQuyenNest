export function formatDateUTC(dateString: string): string {
  if (!dateString) return "";

  const d = new Date(dateString);

  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
