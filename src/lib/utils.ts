import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Zero-pad an index for mono section labels: 3 → "03". */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
