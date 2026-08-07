import React from 'react';
import { TriageFlag } from '../types';
import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface TriageBadgeProps {
  flag: TriageFlag;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const TriageBadge: React.FC<TriageBadgeProps> = ({
  flag,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  let bg = '';
  let text = '';
  let border = '';
  let label = '';
  let dotColor = '';
  let Icon = CheckCircle;

  switch (flag) {
    case 'red':
      bg = 'bg-[#FBEAEA]';
      text = 'text-[#8A2A2A]';
      border = 'border-[#F4C7C7]';
      label = 'Emergency';
      dotColor = 'bg-[#C53030]';
      Icon = AlertTriangle;
      break;
    case 'yellow':
      bg = 'bg-[var(--gold-100)]';
      text = 'text-[var(--gold-700)]';
      border = 'border-[var(--gold-200)]';
      label = 'Urgent';
      dotColor = 'bg-[var(--gold-600)]';
      Icon = AlertCircle;
      break;
    case 'green':
      bg = 'bg-[var(--emerald-100)]';
      text = 'text-[var(--emerald-700)]';
      border = 'border-[#C2E3D0]';
      label = 'Routine';
      dotColor = 'bg-[var(--emerald-600)]';
      Icon = CheckCircle;
      break;
    case 'none':
    default:
      bg = 'bg-[#EFECE6]';
      text = 'text-[var(--ink-soft)]';
      border = 'border-[var(--line)]';
      label = 'Unflagged';
      dotColor = 'bg-[var(--ink-soft)]';
      Icon = HelpCircle;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-bold',
    md: 'text-xs md:text-sm px-3 py-1 gap-2 font-bold',
    lg: 'text-sm md:text-base px-4 py-1.5 gap-2 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${bg} ${text} ${border} ${sizeClasses} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0 animate-pulse`} />
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{label}</span>
    </span>
  );
};
