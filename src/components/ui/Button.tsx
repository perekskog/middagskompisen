import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: any;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ 
  children, onClick, variant = 'primary', size = 'md', className, disabled, icon: Icon, loading, type = 'button' 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    ghost: 'hover:bg-gray-100 text-gray-600',
    outline: 'border border-gray-200 hover:border-gray-400 text-gray-700'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg font-medium'
  };

  return (
    <button 
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <RefreshCw size={size === 'sm' ? 14 : 18} className="animate-spin" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : 18} />
      )}
      {children}
    </button>
  );
};
