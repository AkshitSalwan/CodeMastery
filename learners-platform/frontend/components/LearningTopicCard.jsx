import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Layers3 } from 'lucide-react';
import { Card, CardContent } from '../../../src/components/Card.jsx';
import { Badge } from '../../../src/components/Badge.jsx';

const levelStyles = {
  Beginner: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  Intermediate: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20',
  Advanced: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20',
};

const categoryStyles = {
  Frontend: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  Backend: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
  Database: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  Architecture: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  'Problem Solving': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
};

const LearningTopicCard = ({ topic }) => {
  return (
    <Card className="group h-full rounded-2xl border-border/70 bg-card/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <Badge
            variant="outline"
            className={levelStyles[topic.level] || 'bg-secondary text-secondary-foreground'}
          >
            {topic.level}
          </Badge>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              categoryStyles[topic.category] || 'bg-secondary text-secondary-foreground'
            }`}
          >
            {topic.category}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
            {topic.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {topic.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-accent" />
              <span>{topic.duration}</span>
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-accent" />
              <span>{topic.lessons} lessons</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to={`/learners-platform/topics/${topic.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            Explore topic
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningTopicCard;
