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

export function formatDate(date: string | Date | undefined | null) {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    // Fixed locale 'en-GB' (DD/MM/YYYY) ensures hydration consistency
    return d.toLocaleDateString("en-GB");
  } catch (e) {
    return "—";
  }
}

export function formatTime(date: string | Date | undefined | null) {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    // Fixed locale 'en-GB' ensures hydration consistency for time as well
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "—";
  }
}
