export function parseDateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Choose a valid date.");
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Choose a valid date.");
  }

  return date;
}

export function addOneCalendarMonth(dateValue: string): string {
  const date = parseDateOnly(dateValue);
  const targetMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  const lastDayOfTargetMonth = new Date(
    Date.UTC(targetMonth.getUTCFullYear(), targetMonth.getUTCMonth() + 1, 0),
  ).getUTCDate();
  targetMonth.setUTCDate(Math.min(date.getUTCDate(), lastDayOfTargetMonth));

  return [
    targetMonth.getUTCFullYear(),
    String(targetMonth.getUTCMonth() + 1).padStart(2, "0"),
    String(targetMonth.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function parseOneMonthPeriod(startValue: string, endValue: string): {
  startDate: Date;
  endDate: Date;
} {
  const startDate = parseDateOnly(startValue);
  const endDate = parseDateOnly(endValue);
  if (endValue !== addOneCalendarMonth(startValue)) {
    throw new Error("The course completion period must be exactly one calendar month.");
  }

  return { startDate, endDate };
}
