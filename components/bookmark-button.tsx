'use client';

import { useAuth } from '../lib/contexts/auth-context';
import { Button } from '../components/ui/button';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  problemId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function BookmarkButton({
  problemId,
  variant = 'outline',
  size = 'default',
  showLabel = false,
}: BookmarkButtonProps) {
  const { user, isAuthenticated, toggleBookmark, isBookmarked } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    toggleBookmark(problemId);
  };

  const bookmarked = isBookmarked(problemId);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={bookmarked ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}
    >
      <Bookmark
        className={`h-4 w-4 ${showLabel ? 'mr-2' : ''} ${
          bookmarked ? 'fill-current' : ''
        }`}
      />
      {showLabel && (bookmarked ? 'Bookmarked' : 'Bookmark')}
    </Button>
  );
}
