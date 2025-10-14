import { cn } from '@/lib/utils';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center gap-2 transition-smooth';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        isLoading && 'opacity-70 cursor-wait',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <div className="spinner w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
