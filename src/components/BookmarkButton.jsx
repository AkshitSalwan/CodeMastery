import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export function BookmarkButton({ problemId, size = 'sm' }) {
  const { isBookmarked, toggleBookmark } = useAuth();
  const bookmarked = isBookmarked(problemId);

  return (
    <Button
      variant={bookmarked ? 'default' : 'ghost'}
      size={size}
      onClick={() => toggleBookmark(problemId)}
      className="flex-shrink-0"
      aria-label="Toggle bookmark"
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
    </Button>
  );
}
