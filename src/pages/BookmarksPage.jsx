import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { problems } from '../data/problems';
import { ArrowRight, Bookmark } from 'lucide-react';

export function BookmarksPage() {
  const { user } = useAuth();
  
  const bookmarkedProblems = problems.filter(p => user.bookmarkedProblems.includes(p.id));

  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Bookmarks</h1>
        <p className="text-muted-foreground">Your saved problems ({bookmarkedProblems.length})</p>
      </div>

      {bookmarkedProblems.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Bookmark className="h-12 w-12 opacity-30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No bookmarked problems yet</p>
            <Link to="/problems">
              <Button>Browse Problems</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookmarkedProblems.map((problem) => (
            <Card key={problem.id} className="hover:border-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <Link to={`/problems/${problem.id}`} className="flex-1">
                    <h3 className="font-semibold text-foreground hover:text-accent transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {problem.description.substring(0, 100)}...
                    </p>
                  </Link>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex gap-2">
                      <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <Link to={`/problems/${problem.id}/editor`}>
                      <Button size="sm">
                        Solve <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
