import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'غير محدد'
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatCurrency(amount: number | null | undefined, currencyCode: string = 'USD'): string {
  if (amount === null || amount === undefined) return 'غير محدد'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currencyCode
  }).format(amount)
}

