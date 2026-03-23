import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { ArrowRight, Zap, BookOpen, Trophy } from 'lucide-react';

export function HomePage() {
  const topics = [
    { name: 'Arrays', icon: '📊' },
    { name: 'Strings', icon: '📝' },
    { name: 'Trees', icon: '🌳' },
    { name: 'Graphs', icon: '🕸️' },
    { name: 'Dynamic Programming', icon: '🔄' },
    { name: 'Sorting', icon: '🔢' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-accent">CodeMastery</div>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Link to="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Master Data Structures & Algorithms
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Solve hundreds of DSA problems with an interactive code editor, detailed solutions, and real-time feedback.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 dark:bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
            Why Choose CodeMastery?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg border border-border bg-card">
              <Zap className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Powerful Editor</h3>
              <p className="text-muted-foreground">
                Write code in JavaScript, Python, Java, or C++ with syntax highlighting and instant feedback.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-border bg-card">
              <BookOpen className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Learning Resources</h3>
              <p className="text-muted-foreground">
                Access hints, explanations, and optimal solutions for every problem.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-border bg-card">
              <Trophy className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your streak, level, and achievements as you master DSA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl font-bold text-foreground">Explore Topics</h2>
            <Link to="/sign-up">
              <Button variant="outline">Start With a Free Account</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link key={topic.name} to="/sign-up">
                <div className="p-6 rounded-lg border border-border bg-card hover:border-accent transition-colors cursor-pointer">
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-lg font-bold text-foreground">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">Master {topic.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Coding?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers learning DSA on CodeMastery
          </p>
          <Link to="/sign-up">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CodeMastery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
