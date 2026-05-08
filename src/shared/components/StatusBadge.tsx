import type { StageStatus } from '@/types';
import { cn } from '@/shared/utils';

const statusConfig: Record<StageStatus | string, { label: string; className: string }> = {
  done: { label: 'Hoàn thành', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  active: { label: 'Đang thực hiện', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  upcoming: { label: 'Sắp tới', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  missed: { label: 'Bỏ lỡ', className: 'bg-red-100 text-red-700 border-red-200' },
  member: { label: 'Hội viên', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  reexam: { label: 'Tái khám', className: 'bg-violet-100 text-violet-700 border-violet-200' },
  treatment: { label: 'Đang điều trị', className: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  premium: { label: 'Premium', className: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300' },
  gold: { label: 'Gold', className: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300' },
  silver: { label: 'Silver', className: 'bg-gradient-to-r from-slate-100 to-gray-200 text-slate-700 border-slate-300' },
  basic: { label: 'Basic', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  high: { label: 'Cao', className: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Trung bình', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: 'Thấp', className: 'bg-slate-100 text-slate-500 border-slate-200' },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      config.className,
    )}>
      {label || config.label}
    </span>
  );
}
