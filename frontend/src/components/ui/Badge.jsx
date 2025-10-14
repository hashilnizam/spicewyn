import { cn } from '@/lib/utils';

const Badge = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  };

  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
