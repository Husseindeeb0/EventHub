import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_CATEGORIES = [
  "Tech",
  "Conference",
  "Workshop",
  "Seminar",
  "Meetup",
  "Webinar",
  "Festival",
  "Exhibition",
  "Sports",
] as const;
