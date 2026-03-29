import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn('bg-white border border-gray-100 rounded-3xl p-6 shadow-sm', className)}>
    {children}
  </div>
);
