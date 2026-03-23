// Constants and enumerations

export const USER_ROLES = {
  LEARNER: 'learner',
  INTERVIEWER: 'interviewer',
  ADMIN: 'admin'
};

export const TOPIC_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

export const PROBLEM_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const SUBMISSION_VERDICTS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  WRONG_ANSWER: 'wrong_answer',
  TIME_LIMIT_EXCEEDED: 'time_limit_exceeded',
  MEMORY_LIMIT_EXCEEDED: 'memory_limit_exceeded',
  RUNTIME_ERROR: 'runtime_error',
  COMPILATION_ERROR: 'compilation_error',
  INTERNAL_ERROR: 'internal_error',
  PARTIAL: 'partial'
};

export const CONTEST_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const CONTEST_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  SPECIAL: 'special',
  HIRING: 'hiring'
};

export const RESOURCE_TYPES = {
  VIDEO: 'video',
  ARTICLE: 'article',
  DOCUMENTATION: 'documentation',
  TUTORIAL: 'tutorial',
  COURSE: 'course'
};

export const LEARNING_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const DISCUSSION_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const BADGE_CATEGORIES = {
  PROBLEM_SOLVING: 'problem_solving',
  LEARNING: 'learning',
  CONTEST: 'contest',
  STREAK: 'streak',
  COMMUNITY: 'community',
  SPECIAL: 'special'
};

export const BADGE_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

// Judge0 Language IDs
export const LANGUAGE_IDS = {
  JAVASCRIPT: 63,
  TYPESCRIPT: 74,
  PYTHON: 71,
  JAVA: 62,
  CPP: 54,
  C: 50,
  GO: 60,
  RUST: 73,
  PHP: 68,
  RUBY: 72,
  CSHARP: 51,
  KOTLIN: 78,
  SWIFT: 83
};

// Supported languages for code execution
export const SUPPORTED_LANGUAGES = [
  { id: 63, name: 'JavaScript', extension: 'js', monaco: 'javascript' },
  { id: 74, name: 'TypeScript', extension: 'ts', monaco: 'typescript' },
  { id: 71, name: 'Python', extension: 'py', monaco: 'python' },
  { id: 62, name: 'Java', extension: 'java', monaco: 'java' },
  { id: 54, name: 'C++', extension: 'cpp', monaco: 'cpp' },
  { id: 50, name: 'C', extension: 'c', monaco: 'c' },
  { id: 60, name: 'Go', extension: 'go', monaco: 'go' },
  { id: 73, name: 'Rust', extension: 'rs', monaco: 'rust' }
];

// Spaced repetition intervals (in days)
export const REVISION_INTERVALS = [3, 7, 14, 30, 60, 90];

// Default pagination limits
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 3600,          // 1 hour
  VERY_LONG: 86400     // 24 hours
};
