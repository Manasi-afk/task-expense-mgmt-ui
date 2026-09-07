// The backend's LocalDate fields serialize as plain 'YYYY-MM-DD' strings.
// These helpers convert to/from JS Date objects for mat-datepicker without
// drifting a day via UTC conversion (which Date.toISOString() would do).

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromIsoDate(iso: string | null): Date | null {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}
