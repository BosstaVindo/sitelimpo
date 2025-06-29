import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
  }
  return phone
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
