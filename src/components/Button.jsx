export function Button({ children, className = '', variant = 'default', size = 'md', ...props }) {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-accent text-accent-foreground hover:bg-accent/90',
    outline: 'border border-border text-foreground hover:bg-secondary',
    ghost: 'text-foreground hover:bg-secondary/50',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
