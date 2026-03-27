import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  Globe2,
  PlayCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../src/components/Card.jsx';
import { Badge } from '../../../src/components/Badge.jsx';
import { Button } from '../../../src/components/Button.jsx';
import { useAuth } from '../../../src/context/AuthContext.jsx';
import { problems as allProblems } from '../../../src/data/problems.js';
import {
  getLearnersPlatformTopicAssessmentFeedback,
  getLearnersPlatformTopicAssessment,
  getLearnersPlatformTopic,
  getLearnersPlatformTopicVideos,
} from '../services/learnersPlatformApi.js';
import { getDueSolvedProblemsForTopic, getSolvedProblemsForTopic } from '../services/learningRetention.js';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'videos', label: 'Videos' },
  { id: 'resources', label: 'Web Content' },
  { id: 'problems', label: 'Recommended Problems' },
  { id: 'assessment', label: 'Assessment' },
];

const levelStyles = {
  Beginner: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  Intermediate: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20',
  Advanced: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20',
};

const sourceStyles = {
  GeeksforGeeks: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  MDN: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  'React Docs': 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  'Express Docs': 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
  'AWS Docs': 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
};

const difficultyStyles = {
  Easy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  Hard: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
};

const secondaryLinkStyles =
  'inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary';

const normalizeText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');

function getRecommendedProblems(topic) {
  if (!topic) {
    return [];
  }

  const explicitIds = topic.recommendedProblemIds || [];
  const byId = (topic.recommendedProblemIds || [])
    .map((id) => allProblems.find((problem) => problem.id === id))
    .filter(Boolean);

  if (explicitIds.length > 0) {
    return byId.slice(0, 6);
  }

  const topicKeywords = new Set(
    [
      topic.title,
      topic.category,
      ...(topic.tags || []),
      ...(topic.problemCategories || []),
    ]
      .flatMap((entry) => normalizeText(entry).split(' '))
      .filter((entry) => entry.length > 2)
  );

  const byRelevance = allProblems
    .map((problem) => {
      const problemKeywords = new Set(
        [
          problem.title,
          problem.description,
          ...(problem.category || []),
        ]
          .flatMap((entry) => normalizeText(entry).split(' '))
          .filter((entry) => entry.length > 2)
      );

      const keywordHits = [...topicKeywords].filter((keyword) => problemKeywords.has(keyword)).length;
      const categoryHits = (problem.category || []).filter((category) =>
        (topic.problemCategories || []).includes(category)
      ).length;

      return {
        problem,
        score: keywordHits + categoryHits * 2,
      };
    })
    .filter((entry) => entry.score >= 2)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.problem);

  return byRelevance.slice(0, 6);
}

const LearnersPlatformTopicPage = ({ apiBaseUrl = '/api/learners-platform' }) => {
  const { user, saveAssessmentResult } = useAuth();
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [videosConfigured, setVideosConfigured] = useState(true);
  const [videosMessage, setVideosMessage] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentLoaded, setAssessmentLoaded] = useState(false);
  const [assessmentMessage, setAssessmentMessage] = useState('');
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [interviewAnswers, setInterviewAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const loadTopic = async () => {
      try {
        setLoading(true);
        setError('');
        setTopic(null);
        setActiveTab('overview');
        setVideos([]);
        setVideosLoading(false);
        setVideosLoaded(false);
        setVideosConfigured(true);
        setVideosMessage('');
        setAssessment(null);
        setAssessmentLoading(false);
        setAssessmentLoaded(false);
        setAssessmentMessage('');
        setAssessmentCompleted(false);
        setMcqAnswers({});
        setInterviewAnswers({});
        setFeedback(null);
        setFeedbackLoading(false);
        setFeedbackMessage('');

        const response = await getLearnersPlatformTopic(apiBaseUrl, slug);
        setTopic(response.topic || null);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load topic.');
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [apiBaseUrl, slug]);

  useEffect(() => {
    if (activeTab !== 'videos' || !topic || videosLoaded || videosLoading) {
      return;
    }

    const loadVideos = async () => {
      try {
        setVideosLoading(true);

        const response = await getLearnersPlatformTopicVideos(apiBaseUrl, slug);
        setVideos(response.videos || []);
        setVideosConfigured(response.configured !== false);
        setVideosMessage(response.message || '');
        setVideosLoaded(true);
      } catch (loadError) {
        setVideos([]);
        setVideosConfigured(true);
        setVideosMessage(loadError.message || 'Failed to load videos.');
      } finally {
        setVideosLoading(false);
      }
    };

    loadVideos();
  }, [activeTab, apiBaseUrl, slug, topic, videosLoaded, videosLoading]);

  const solvedProblemsForTopic = useMemo(() => getSolvedProblemsForTopic(user, topic), [topic, user]);
  const dueSolvedProblems = useMemo(() => getDueSolvedProblemsForTopic(user, topic), [topic, user]);

  const recommendedProblems = useMemo(() => getRecommendedProblems(topic), [topic]);

  useEffect(() => {
    if (
      activeTab !== 'assessment' ||
      !topic ||
      assessmentLoaded ||
      assessmentLoading ||
      solvedProblemsForTopic.length === 0
    ) {
      return;
    }

    const loadAssessment = async () => {
      try {
        setAssessmentLoading(true);
        setAssessmentMessage('');

        const response = await getLearnersPlatformTopicAssessment(
          apiBaseUrl,
          slug,
          solvedProblemsForTopic
        );

        setAssessment(response.assessment || null);
        setAssessmentLoaded(true);
        setFeedback(null);
        setFeedbackMessage('');
      } catch (loadError) {
        setAssessment(null);
        setAssessmentMessage(loadError.message || 'Failed to load assessment.');
      } finally {
        setAssessmentLoading(false);
      }
    };

    loadAssessment();
  }, [
    activeTab,
    apiBaseUrl,
    assessmentLoaded,
    assessmentLoading,
    slug,
    solvedProblemsForTopic,
    topic,
  ]);

  const handleAssessmentComplete = () => {
    if (!topic || (!assessment?.mcqs?.length && !assessment?.interviewQuestions?.length)) {
      return;
    }

    const relatedProblemIds = [...(assessment.mcqs || []), ...(assessment.interviewQuestions || [])]
      .map((question) => question.relatedProblemId)
      .filter(Boolean);

    saveAssessmentResult({
      topicSlug: topic.slug,
      questionIds: relatedProblemIds,
    });
    setAssessmentCompleted(true);
  };

  const handleInterviewAnswerChange = (questionId, value) => {
    setInterviewAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleMcqAnswerSelect = (questionId, optionIndex) => {
    setMcqAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleGenerateFeedback = async () => {
    if (!topic || !assessment) {
      return;
    }

    try {
      setFeedbackLoading(true);
      setFeedbackMessage('');

      const response = await getLearnersPlatformTopicAssessmentFeedback(apiBaseUrl, slug, assessment, {
        mcqAnswers,
        interviewAnswers,
      });

      setFeedback(response.feedback || null);
    } catch (loadError) {
      setFeedback(null);
      setFeedbackMessage(loadError.message || 'Failed to generate feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-sm text-muted-foreground">
          Loading topic details...
        </CardContent>
      </Card>
    );
  }

  if (error || !topic) {
    return (
      <Card className="rounded-2xl border-red-500/30 bg-red-500/5">
        <CardContent className="p-8">
          <p className="text-lg font-medium text-foreground">Topic unavailable</p>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            {error || 'We could not find that topic.'}
          </p>
          <Link to="/learners-platform" className={`mt-5 ${secondaryLinkStyles}`}>
            Back to learning hub
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/learners-platform"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to learning hub
        </Link>
        <Badge
          variant="outline"
          className={levelStyles[topic.level] || 'bg-secondary text-secondary-foreground'}
        >
          {topic.level}
        </Badge>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-background via-card to-accent/10 shadow-sm">
        <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge>{topic.category}</Badge>
              {topic.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {topic.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                {topic.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => setActiveTab('videos')}>
                Open video picks
                <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => setActiveTab('problems')}>
                Practice now
                <Code2 className="ml-2 h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => setActiveTab('assessment')}>
                Review retention
                <BrainCircuit className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="rounded-[1.5rem] border-border/70 bg-card/85 shadow-none">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Duration</p>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Clock3 className="h-4 w-4 text-accent" />
                  {topic.duration}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Lessons</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{topic.lessons}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Web resources</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{topic.resources.length}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Recommended problems</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{recommendedProblems.length}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Solved in this topic</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{solvedProblemsForTopic.length}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Due for review</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{dueSolvedProblems.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant={activeTab === tab.id ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[1.5rem]">
            <CardHeader className="border-border/70">
              <CardTitle className="text-2xl">Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topic.roadmap.map((step) => (
                <div
                  key={`${step.phase}-${step.title}`}
                  className="rounded-2xl border border-border/70 bg-background/60 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {step.phase}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[1.5rem]">
              <CardHeader className="border-border/70">
                <CardTitle className="text-2xl">Learning outcomes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topic.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                    <p className="text-sm leading-6 text-foreground">{outcome}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[1.5rem]">
              <CardHeader className="border-border/70">
                <CardTitle className="text-2xl">Practice focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{topic.practiceFocus}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {activeTab === 'videos' ? (
        <Card className="rounded-[1.5rem]">
          <CardHeader className="border-border/70">
            <CardTitle className="text-2xl">Recommended videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {!videosConfigured ? (
              <p className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-sm text-muted-foreground">
                Add `YOUTUBE_API_KEY` to the backend environment to unlock YouTube recommendations here.
              </p>
            ) : null}

            {videosLoading ? (
              <p className="text-sm text-muted-foreground">Loading videos...</p>
            ) : null}

            {!videosLoading && videosMessage && videos.length === 0 ? (
              <p className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-sm text-muted-foreground">
                {videosMessage}
              </p>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-2">
              {videos.map((video) => (
                <article
                  key={video.id}
                  className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-sm"
                >
                  <a href={video.watchUrl} target="_blank" rel="noreferrer" className="block">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="aspect-video w-full object-cover"
                    />
                  </a>
                  <div className="space-y-3 p-5">
                    <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                    <a
                      href={video.watchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                    >
                      Watch on YouTube
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'resources' ? (
        <Card className="rounded-[1.5rem]">
          <CardHeader className="border-border/70">
            <CardTitle className="text-2xl">Curated web content</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-2">
            {topic.resources.map((resource) => (
              <article
                key={`${resource.source}-${resource.title}`}
                className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={sourceStyles[resource.source] || 'bg-secondary text-secondary-foreground'}
                  >
                    {resource.source}
                  </Badge>
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {resource.type}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{resource.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                >
                  Open resource
                  <Globe2 className="h-4 w-4" />
                </a>
              </article>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'problems' ? (
        <Card className="rounded-[1.5rem]">
          <CardHeader className="border-border/70">
            <CardTitle className="text-2xl">Recommended CodeMastery problems</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-7 text-muted-foreground">{topic.practiceFocus}</p>

            {recommendedProblems.length > 0 ? (
              <div className="grid gap-4">
                {recommendedProblems.map((problem) => (
                  <article
                    key={problem.id}
                    className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 transition-colors hover:border-accent/50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Link
                          to={`/problems/${problem.id}`}
                          className="text-lg font-semibold text-foreground transition-colors hover:text-accent"
                        >
                          {problem.title}
                        </Link>
                        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                          {problem.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={difficultyStyles[problem.difficulty] || 'bg-secondary text-secondary-foreground'}
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {problem.category.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        Acceptance {problem.acceptanceRate}% · {problem.companies.length} company tags
                      </div>
                      <Link to={`/problems/${problem.id}`} className={secondaryLinkStyles}>
                        Solve problem
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-border/70 bg-secondary/30 p-5">
                <p className="text-lg font-semibold text-foreground">Topic-specific practice is being curated</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This topic currently leans more on videos, web content, and interview-style review than on the
                  existing DSA problem bank. We are hiding unrelated problems here so the learning path stays relevant.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'assessment' ? (
        <Card className="rounded-[1.5rem]">
          <CardHeader className="border-border/70">
            <CardTitle className="text-2xl">Adaptive reassessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {solvedProblemsForTopic.length === 0 ? (
              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5 text-sm text-muted-foreground">
                Solve a few problems connected to this topic first. Once you have accepted submissions,
                CodeMastery will generate follow-up review questions here so you do not forget the pattern.
              </div>
            ) : null}

            {solvedProblemsForTopic.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Solved problems used</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{solvedProblemsForTopic.length}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Due right now</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{dueSolvedProblems.length}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Assessment mode</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {assessment?.source === 'gemini' ? 'AI-generated' : 'Adaptive fallback'}
                  </p>
                </div>
              </div>
            ) : null}

            {assessmentLoading ? (
              <p className="text-sm text-muted-foreground">Building your reassessment...</p>
            ) : null}

            {!assessmentLoading && assessmentMessage ? (
              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-sm text-muted-foreground">
                {assessmentMessage}
              </div>
            ) : null}

            {assessment?.focusAreas?.length ? (
              <div className="flex flex-wrap gap-2">
                {assessment.focusAreas.map((area) => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : null}

            {(assessment?.mcqs || []).length ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    MCQ Test
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">Quick concept check</h3>
                </div>
                <div className="grid gap-4">
                  {(assessment?.mcqs || []).map((question, index) => (
                    <article
                      key={question.id}
                      className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            MCQ {index + 1}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-foreground">{question.title}</h3>
                        </div>
                        {question.focusArea ? <Badge variant="outline">{question.focusArea}</Badge> : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{question.prompt}</p>
                      <div className="mt-4 grid gap-3">
                        {(question.options || []).map((option, optionIndex) => {
                          const selected = mcqAnswers[question.id] === optionIndex;
                          return (
                            <button
                              key={`${question.id}-${optionIndex}`}
                              type="button"
                              onClick={() => handleMcqAnswerSelect(question.id, optionIndex)}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                                selected
                                  ? 'border-accent bg-accent/10 text-foreground'
                                  : 'border-border/70 bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {(assessment?.interviewQuestions || []).length ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Interview Round
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">Type your interview answers</h3>
                </div>
                <div className="grid gap-4">
                  {(assessment?.interviewQuestions || []).map((question, index) => (
                    <article
                      key={question.id}
                      className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            Interview Question {index + 1}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-foreground">{question.title}</h3>
                        </div>
                        {question.focusArea ? <Badge variant="outline">{question.focusArea}</Badge> : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{question.prompt}</p>
                      {(question.answerGuide || []).length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {question.answerGuide.map((guide) => (
                            <Badge key={guide} variant="secondary">
                              {guide}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Your answer
                        </label>
                        <textarea
                          value={interviewAnswers[question.id] || ''}
                          onChange={(event) => handleInterviewAnswerChange(question.id, event.target.value)}
                          placeholder="Type how you would answer this in a real interview..."
                          className="min-h-36 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {(assessment?.mcqs?.length || assessment?.interviewQuestions?.length) ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-5">
                <div>
                  <p className="font-medium text-foreground">Ready for AI feedback?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Gemini will review your topic test and interview-style answers when configured.
                  </p>
                </div>
                <Button type="button" onClick={handleGenerateFeedback} disabled={feedbackLoading}>
                  {feedbackLoading ? 'Generating feedback...' : 'Generate feedback'}
                </Button>
              </div>
            ) : null}

            {feedbackMessage ? (
              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4 text-sm text-muted-foreground">
                {feedbackMessage}
              </div>
            ) : null}

            {feedback ? (
              <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-card/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Feedback Report
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-foreground">AI review</h3>
                  </div>
                  <Badge variant="outline">{feedback.overallRating}</Badge>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{feedback.summary}</p>

                {(feedback.nextSteps || []).length ? (
                  <div className="grid gap-3 md:grid-cols-3">
                    {feedback.nextSteps.map((step) => (
                      <div key={step} className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-foreground">
                        {step}
                      </div>
                    ))}
                  </div>
                ) : null}

                {(feedback.mcqFeedback || []).length ? (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">MCQ review</h4>
                    {feedback.mcqFeedback.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-medium text-foreground">{item.title}</p>
                          <Badge variant={item.isCorrect ? 'secondary' : 'outline'}>
                            {item.isCorrect ? 'Correct' : 'Review this'}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {(feedback.interviewFeedback || []).length ? (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Interview answer review</h4>
                    {feedback.interviewFeedback.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-medium text-foreground">{item.title}</p>
                          <Badge variant="outline">{item.rating}</Badge>
                        </div>
                        {(item.strengths || []).length ? (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-foreground">Strengths</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.strengths.map((strength) => (
                                <Badge key={strength} variant="secondary">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        {(item.improvements || []).length ? (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-foreground">Improve next</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.improvements.map((improvement) => (
                                <Badge key={improvement} variant="outline">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {(assessment?.mcqs?.length || assessment?.interviewQuestions?.length) ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-5">
                <div>
                  <p className="font-medium text-foreground">Finished reviewing these questions?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mark this reassessment complete to push the next review window forward.
                  </p>
                </div>
                <Button type="button" onClick={handleAssessmentComplete} disabled={assessmentCompleted}>
                  {assessmentCompleted ? 'Assessment saved' : 'Mark assessment complete'}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default LearnersPlatformTopicPage;
