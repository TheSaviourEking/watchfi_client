import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(input, decimalPlaces = 2) {
  return Number(input).toFixed(decimalPlaces)
}