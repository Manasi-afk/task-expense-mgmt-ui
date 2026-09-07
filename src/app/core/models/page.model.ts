// Mirrors the subset of Spring Data's Page<T> JSON payload the UI actually needs.
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index, 0-based
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
