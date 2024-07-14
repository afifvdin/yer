import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COLORS = [
  "text-red-500 dark:text-red-700",
  "text-red-400 dark:text-red-600",
  "text-orange-500 dark:text-orange-700",
  "text-orange-400 dark:text-orange-600",
  "text-amber-500 dark:text-amber-700",
  "text-amber-400 dark:text-amber-600",
  "text-yellow-500 dark:text-yellow-700",
  "text-yellow-400 dark:text-yellow-600",
  "text-lime-500 dark:text-lime-700",
  "text-lime-400 dark:text-lime-600",
  "text-green-500 dark:text-green-700",
  "text-green-400 dark:text-green-600",
  "text-emerald-500 dark:text-emerald-700",
  "text-emerald-400 dark:text-emerald-600",
  "text-teal-500 dark:text-teal-700",
  "text-teal-400 dark:text-teal-600",
  "text-cyan-500 dark:text-cyan-700",
  "text-cyan-400 dark:text-cyan-600",
  "text-sky-500 dark:text-sky-700",
  "text-sky-400 dark:text-sky-600",
  "text-blue-500 dark:text-blue-700",
  "text-blue-400 dark:text-blue-600",
  "text-indigo-500 dark:text-indigo-700",
  "text-indigo-400 dark:text-indigo-600",
  "text-violet-500 dark:text-violet-700",
  "text-violet-400 dark:text-violet-600",
  "text-purple-500 dark:text-purple-700",
  "text-purple-400 dark:text-purple-600",
  "text-fuchsia-500 dark:text-fuchsia-700",
  "text-fuchsia-400 dark:text-fuchsia-600",
  "text-pink-500 dark:text-pink-700",
  "text-pink-400 dark:text-pink-600",
  "text-rose-500 dark:text-rose-700",
  "text-rose-400 dark:text-rose-600",
]

export function getRandomTagColor() {
  const random = Math.floor(Math.random() * COLORS.length)
  return random
}
