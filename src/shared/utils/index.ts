import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function getProgramLabel(program: string): string {
  const labels: Record<string, string> = {
    maternity: 'Sản khoa',
    vaccination: 'Tiêm chủng',
    pediatric: 'Nhi khoa',
    gynecology: 'Phụ khoa',
  };
  return labels[program] || program;
}

export function getSpecialtyLabel(specialty: string): string {
  const labels: Record<string, string> = {
    san: 'Sản khoa',
    nhi: 'Nhi khoa',
    phu_khoa: 'Phụ khoa',
  };
  return labels[specialty] || specialty;
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(-2).toUpperCase();
}
