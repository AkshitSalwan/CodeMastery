import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <p className="text-lg font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Bio</p>
            <p className="text-foreground mt-1">{user.bio}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-semibold text-foreground">{user.createdAt.toLocaleDateString()}</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Bookmarks</p>
              <p className="font-semibold text-foreground">{user.bookmarkedProblems.length} problems</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
