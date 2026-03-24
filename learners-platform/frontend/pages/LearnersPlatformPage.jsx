import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  Filter,
  GraduationCap,
  LibraryBig,
  BrainCircuit,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '../../../src/components/Card.jsx';
import { Badge } from '../../../src/components/Badge.jsx';
import { useAuth } from '../../../src/context/AuthContext.jsx';
import LearningTopicCard from '../components/LearningTopicCard.jsx';
import {
  getFeaturedLearnersPlatformTopics,
  getLearnersPlatformMeta,
  getLearnersPlatformTopics,
} from '../services/learnersPlatformApi.js';
import { getDueReviewTopics, getSolvedProblemsList } from '../services/learningRetention.js';

const defaultMeta = {
  title: 'Learning Hub',
  subtitle: 'Structured tracks for learners who want resources and practice in one place.',
  stats: {
    topics: 0,
    featuredTracks: 0,
    categories: 0,
  },
};

const featureHighlights = [
  {
    icon: PlayCircle,
    label: 'Video paths',
    description: 'Jump into YouTube walkthroughs when you want guided momentum.',
  },
  {
    icon: LibraryBig,
    label: 'Web content',
    description: 'Keep docs and curated reading close to the practice flow.',
  },
  {
    icon: BookOpenCheck,
    label: 'Practice links',
    description: 'Move from learning directly into recommended CodeMastery problems.',
  },
  {
    icon: BrainCircuit,
    label: 'Adaptive review',
    description: 'Reassess topics from your solved problems before the concepts fade.',
  },
];

const primaryLinkStyles =
  'inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90';

const secondaryLinkStyles =
  'inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary';

const LearnersPlatformPage = ({ apiBaseUrl = '/api/learners-platform' }) => {
  const { user } = useAuth();
  const [meta, setMeta] = useState(defaultMeta);
  const [filters, setFilters] = useState({
    levels: ['All'],
    categories: ['All'],
  });
  const [topics, setTopics] = useState([]);
  const [featuredTopics, setFeaturedTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError('');

        const [metaResponse, topicsResponse, featuredResponse] = await Promise.all([
          getLearnersPlatformMeta(apiBaseUrl),
          getLearnersPlatformTopics(apiBaseUrl),
          getFeaturedLearnersPlatformTopics(apiBaseUrl),
        ]);

        setMeta(metaResponse.meta || defaultMeta);
        setFilters(metaResponse.filters || { levels: ['All'], categories: ['All'] });
        setTopics(topicsResponse.topics || []);
        setFeaturedTopics(featuredResponse.topics || []);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load learning hub data.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [apiBaseUrl]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setError('');

        const response = await getLearnersPlatformTopics(apiBaseUrl, {
          search: deferredSearch,
          level,
          category,
        });

        setTopics(response.topics || []);
      } catch (loadError) {
        setError(loadError.message || 'Failed to update topics.');
      }
    };

    loadTopics();
  }, [apiBaseUrl, deferredSearch, level, category]);

  const topicCountLabel = useMemo(() => {
    if (topics.length === 1) {
      return '1 topic';
    }

    return `${topics.length} topics`;
  }, [topics.length]);

  const solvedProblemsCount = useMemo(() => getSolvedProblemsList(user).length, [user]);
  const dueReviewTopics = useMemo(() => getDueReviewTopics(user, topics), [topics, user]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-accent/10 via-background to-secondary/70 shadow-sm">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.3fr_0.9fr] lg:px-10 lg:py-10">
          <div className="space-y-6">
            <Badge className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
              <GraduationCap className="h-4 w-4" />
              User Learning Feature
            </Badge>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {meta.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {meta.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={featuredTopics[0] ? `/learners-platform/topics/${featuredTopics[0].slug}` : '/learners-platform'}
                className={primaryLinkStyles}
              >
                Start a featured track
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#all-topics" className={secondaryLinkStyles}>
                Browse all topics
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border-border/60 bg-card/80 shadow-none">
                <CardContent className="px-5 py-5">
                  <p className="text-sm text-muted-foreground">Topic Tracks</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{meta.stats.topics}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/60 bg-card/80 shadow-none">
                <CardContent className="px-5 py-5">
                  <p className="text-sm text-muted-foreground">Featured Paths</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{meta.stats.featuredTracks}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/60 bg-card/80 shadow-none">
                <CardContent className="px-5 py-5">
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{meta.stats.categories}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-border/60 bg-card/85 shadow-none">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
                <div>
                  <p className="text-sm text-muted-foreground">Retention review</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {dueReviewTopics.length > 0
                      ? `${dueReviewTopics.length} topics are due for reassessment`
                      : 'No specific review topics due right now'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dueReviewTopics.length > 0 ? `Based on ${solvedProblemsCount} solved problems tracked in your learning profile.` : 'Keep solving problems to build your personalized review schedule.'}
                  </p>
                </div>
                {dueReviewTopics[0] ? (
                  <Link
                    to={`/learners-platform/topics/${dueReviewTopics[0].topic.slug}`}
                    className={secondaryLinkStyles}
                  >
                    Review now
                  </Link>
                ) : (
                  <Link to="/daily-challenges" className={secondaryLinkStyles}>
                    Do Daily Challenge
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[1.75rem] border-border/60 bg-card/85 shadow-xl shadow-accent/5">
            <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  What you get
                </p>
                <h2 className="text-2xl font-semibold text-foreground">
                  A cleaner learning flow inside CodeMastery
                </h2>
              </div>

              <div className="space-y-4">
                {featureHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-accent/10 p-2 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Featured Tracks
            </p>
            <h2 className="mt-1 text-3xl font-bold text-foreground">Start with a guided path</h2>
          </div>
          <Badge variant="outline" className="rounded-full px-4 py-1.5">
            <Sparkles className="mr-2 inline h-3.5 w-3.5" />
            {featuredTopics.length} highlighted
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featuredTopics.map((topic) => (
            <Link key={topic.slug} to={`/learners-platform/topics/${topic.slug}`} className="block">
              <Card className="h-full rounded-2xl border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge>{topic.category}</Badge>
                    <span className="text-sm text-muted-foreground">{topic.level}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{topic.title}</h3>
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                    <span>{topic.duration}</span>
                    <span>{topic.lessons} lessons</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="all-topics" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Topic Library
            </p>
            <h2 className="mt-1 text-3xl font-bold text-foreground">Browse all topics</h2>
            <p className="mt-2 text-sm text-muted-foreground">{topicCountLabel} matched your filters</p>
          </div>
        </div>

        <Card className="rounded-[1.75rem] border-border/70">
          <CardContent className="p-5 sm:p-6">
            <div className="grid gap-3 lg:grid-cols-[1.8fr_0.8fr_0.8fr]">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Filter className="h-4 w-4 text-accent" />
                  Search topics
                </span>
                <input
                  type="search"
                  placeholder="Try React, SQL, system design..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Level</span>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                >
                  {filters.levels.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                >
                  {filters.categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="rounded-2xl">
            <CardContent className="p-8 text-sm text-muted-foreground">
              Loading topics...
            </CardContent>
          </Card>
        ) : null}

        {error ? (
          <Card className="rounded-2xl border-red-500/30 bg-red-500/5">
            <CardContent className="p-6 text-sm text-red-600 dark:text-red-300">
              {error}
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <LearningTopicCard key={topic.slug} topic={topic} />
          ))}
        </div>

        {!loading && topics.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-8 text-center">
              <p className="text-lg font-medium text-foreground">No topics matched those filters.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try broadening your search or switching back to `All`.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
};

export default LearnersPlatformPage;
