import { Link } from 'react-router-dom';
import { SignIn } from '@clerk/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome to CodeMastery</CardTitle>
          <p className="text-center text-muted-foreground mt-2 text-sm">Master DSA, conquer interviews</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none border border-border',
                },
              }}
            />
          </div>

          {/* Sign up Link */}
          <div className="mt-6 text-center">
            <span className="text-muted-foreground text-sm">Don't have an account? </span>
            <Link to="/sign-up" className="text-accent font-medium hover:underline text-sm">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
