export type Entry = {
  active: boolean;
  duration: number | string;
  rating: number;
  note: string;
};

export type EntryMap = Record<number, Entry>;

export const TOTAL_DAYS = 42;

export const initialEntries: EntryMap = {};