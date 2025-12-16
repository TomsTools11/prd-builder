import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export function estimatePageCount(text: string): number {
  // Rough estimate: ~500 words per page
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 500);
}

export function countSections(markdown: string): number {
  const headingMatches = markdown.match(/^#{1,2}\s/gm);
  return headingMatches ? headingMatches.length : 0;
}
