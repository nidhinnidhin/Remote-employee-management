export function formatDateISO(date: string | Date | undefined | null) {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    return d.toISOString().split("T")[0];
  } catch (e) {
    return "—";
  }
}
