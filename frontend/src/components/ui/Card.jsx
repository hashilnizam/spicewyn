import { cn } from '@/lib/utils';

const Card = ({ children, className, ...props }) => {
  return (
    <div className={cn('card p-6', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
