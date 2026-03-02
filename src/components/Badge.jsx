export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-accent text-accent-foreground',
    outline: 'border border-border text-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive/20 text-destructive',
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
