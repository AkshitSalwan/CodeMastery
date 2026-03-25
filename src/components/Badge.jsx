export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-accent text-accent-foreground',
    outline: 'border border-border text-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive/20 text-destructive',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium leading-none ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
