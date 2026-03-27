import bcrypt from 'bcryptjs';
import { syncDatabase } from '../config/database.js';
import {
  Contest,
  ContestParticipant,
  Problem,
  User,
  sequelize,
} from '../models/index.js';

const avatarFor = (seed) => `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

const seedUsers = [
  {
    email: 'admin@codemastery.com',
    username: 'admin',
    password: 'admin123456',
    role: 'admin',
    bio: 'Platform administrator for CodeMastery demo data.',
  },
  {
    email: 'interviewer@codemastery.com',
    username: 'interviewer',
    password: 'interview123456',
    role: 'interviewer',
    bio: 'Interviewer account used for seeded contests and tests.',
  },
  {
    email: 'user@codemastery.com',
    username: 'learner',
    password: 'demo123456',
    role: 'learner',
    bio: 'Learner account for seeded contest participation.',
  },
];

const problemSeeds = [
  {
    slug: 'search-in-sorted-array',
    title: 'Search in Sorted Array',
    difficulty: 'easy',
    points: 80,
    tags: ['Array', 'Binary Search'],
    description:
      'Given a sorted array of integers and a target value, return the 0-based index of the target. Return -1 if the target is not present.',
    constraints: ['1 <= n <= 10^5', '-10^9 <= arr[i], target <= 10^9', 'Array is sorted in non-decreasing order'],
    examples: [
      {
        input: '5\n1 3 5 7 9\n7',
        output: '3',
        explanation: '7 is present at index 3.',
      },
      {
        input: '6\n2 4 6 8 10 12\n5',
        output: '-1',
        explanation: '5 is not present in the array.',
      },
    ],
    test_cases: [
      { input: '5\n1 3 5 7 9\n7', output: '3', explanation: 'Target found in the middle.' },
      { input: '1\n42\n42', output: '0', explanation: 'Single element match.' },
    ],
    hidden_test_cases: [
      { input: '1\n42\n7', output: '-1' },
      { input: '8\n-10 -5 -2 0 3 4 8 12\n12', output: '7' },
      { input: '5\n10 20 30 40 50\n35', output: '-1' },
    ],
    hints: ['Use binary search because the array is sorted.', 'Check the middle element first and shrink the search range.'],
    solution:
      'Use binary search with two pointers `low` and `high`. Repeatedly inspect the middle element and move left or right until the target is found or the range becomes empty.',
    starter_code: {
      javascript:
        "function solve(input) {\n  // TODO: parse n, array, and target\n  // TODO: implement binary search\n  return '';\n}\n\nmodule.exports = { solve };",
      python:
        "def solve(input_data: str) -> str:\n    # TODO: parse n, array, and target\n    # TODO: implement binary search\n    return ''",
    },
  },
  {
    slug: 'pair-sum-target',
    title: 'Pair Sum Target',
    difficulty: 'easy',
    points: 100,
    tags: ['Array', 'Hash Table'],
    description:
      'Given an array of integers and a target sum, return the indices of the first pair whose values add up to the target. Return -1 -1 if no such pair exists.',
    constraints: ['2 <= n <= 10^5', '-10^9 <= arr[i], target <= 10^9'],
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: '2 + 7 = 9.',
      },
    ],
    test_cases: [
      { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'Basic pair present.' },
      { input: '5\n1 2 3 4 5\n10', output: '-1 -1', explanation: 'No valid pair.' },
    ],
    hidden_test_cases: [
      { input: '6\n-3 4 3 90 1 2\n0', output: '0 2' },
      { input: '5\n3 3 4 5 6\n6', output: '0 1' },
      { input: '3\n1 1 1\n5', output: '-1 -1' },
    ],
    hints: ['Store previously seen values in a map.', 'For each value x, look for target - x.'],
    solution:
      'Scan the array once while storing each value and its index in a hash map. If `target - current` is already in the map, return that earlier index and the current index.',
    starter_code: {
      javascript:
        "function solve(input) {\n  // TODO: parse n, array, and target\n  // TODO: return the pair of indices\n  return '';\n}\n\nmodule.exports = { solve };",
      python:
        "def solve(input_data: str) -> str:\n    # TODO: parse n, array, and target\n    # TODO: return the pair of indices\n    return ''",
    },
  },
  {
    slug: 'valid-parentheses-sequence',
    title: 'Valid Parentheses Sequence',
    difficulty: 'medium',
    points: 120,
    tags: ['Stack', 'String'],
    description:
      'Given a string containing only brackets `()[]{}`, determine if the sequence is balanced. Output `true` or `false`.',
    constraints: ['1 <= s.length <= 10^5'],
    examples: [
      { input: '()[]{}', output: 'true', explanation: 'Every opening bracket is closed in order.' },
      { input: '([)]', output: 'false', explanation: 'Bracket ordering is invalid.' },
    ],
    test_cases: [
      { input: '()[]{}', output: 'true', explanation: 'Simple valid case.' },
      { input: '([)]', output: 'false', explanation: 'Crossed brackets are invalid.' },
    ],
    hidden_test_cases: [
      { input: '(((())))', output: 'true' },
      { input: '(((()))', output: 'false' },
      { input: '{[()()]}', output: 'true' },
    ],
    hints: ['Use a stack to track opening brackets.', 'On each closing bracket, verify it matches the latest opening bracket.'],
    solution:
      'Use a stack. Push opening brackets, and for each closing bracket ensure the top of the stack is the matching opening bracket. The stack must be empty at the end.',
    starter_code: {
      javascript:
        "function solve(input) {\n  // TODO: read the bracket string\n  // TODO: validate using a stack\n  return '';\n}\n\nmodule.exports = { solve };",
    },
  },
  {
    slug: 'merge-overlapping-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'medium',
    points: 150,
    tags: ['Array', 'Sorting'],
    description:
      'Given a list of intervals, merge all overlapping intervals and print the resulting intervals in sorted order.',
    constraints: ['1 <= n <= 10^5', '0 <= start <= end <= 10^9'],
    examples: [
      {
        input: '4\n1 3\n2 6\n8 10\n15 18',
        output: '1 6\n8 10\n15 18',
        explanation: 'The first two intervals overlap and are merged.',
      },
    ],
    test_cases: [
      {
        input: '4\n1 3\n2 6\n8 10\n15 18',
        output: '1 6\n8 10\n15 18',
        explanation: 'Basic overlap merge.',
      },
      {
        input: '3\n1 4\n4 5\n9 11',
        output: '1 5\n9 11',
        explanation: 'Touching intervals are treated as overlapping.',
      },
    ],
    hidden_test_cases: [
      { input: '1\n5 7', output: '5 7' },
      { input: '3\n1 10\n2 3\n4 5', output: '1 10' },
      { input: '4\n1 2\n3 4\n5 6\n7 8', output: '1 2\n3 4\n5 6\n7 8' },
    ],
    hints: ['Sort intervals by start time first.', 'Merge into the latest interval if the next one overlaps.'],
    solution:
      'Sort by start time. Iterate once, extending the latest merged interval whenever the next interval overlaps; otherwise start a new merged interval.',
    starter_code: {
      javascript:
        "function solve(input) {\n  // TODO: parse intervals\n  // TODO: sort and merge overlaps\n  return '';\n}\n\nmodule.exports = { solve };",
    },
  },
  {
    slug: 'level-order-binary-tree',
    title: 'Binary Tree Level Order',
    difficulty: 'hard',
    points: 200,
    tags: ['Tree', 'BFS'],
    description:
      'Given a binary tree in level-order array form with `null` placeholders, print the level order traversal line by line.',
    constraints: ['1 <= number of nodes <= 10^5'],
    examples: [
      {
        input: '7\n3 9 20 null null 15 7',
        output: '3\n9 20\n15 7',
        explanation: 'Nodes are grouped by depth.',
      },
    ],
    test_cases: [
      {
        input: '7\n3 9 20 null null 15 7',
        output: '3\n9 20\n15 7',
        explanation: 'Standard BFS traversal.',
      },
      {
        input: '1\n1',
        output: '1',
        explanation: 'Single node tree.',
      },
    ],
    hidden_test_cases: [
      { input: '3\n1 2 3', output: '1\n2 3' },
      { input: '5\n1 2 null 3 null', output: '1\n2\n3' },
      { input: '0\n', output: '' },
    ],
    hints: ['Use a queue for breadth-first traversal.', 'Process one level at a time using the current queue size.'],
    solution:
      'Build the tree or simulate level traversal from the array representation, then use BFS with a queue to collect nodes depth by depth.',
    starter_code: {
      javascript:
        "function solve(input) {\n  // TODO: parse the tree representation\n  // TODO: perform level-order traversal\n  return '';\n}\n\nmodule.exports = { solve };",
    },
  },
];

const contestSeeds = [
  {
    slug: 'binary-search-blitz',
    title: 'Binary Search Blitz',
    description: 'Fast-paced interview contest focused on binary search and array reasoning.',
    type: 'hiring',
    status: 'ongoing',
    problemSlugs: ['search-in-sorted-array', 'pair-sum-target'],
    startsOffsetMinutes: -30,
    endsOffsetMinutes: 90,
    penalty: 10,
  },
  {
    slug: 'stack-and-interval-marathon',
    title: 'Stack and Interval Marathon',
    description: 'A medium-difficulty round on stacks, interval merging, and careful testcase handling.',
    type: 'hiring',
    status: 'ongoing',
    problemSlugs: ['valid-parentheses-sequence', 'merge-overlapping-intervals'],
    startsOffsetMinutes: -10,
    endsOffsetMinutes: 110,
    penalty: 15,
  },
  {
    slug: 'tree-traversal-showdown',
    title: 'Tree Traversal Showdown',
    description: 'Completed contest seeded with leaderboard data for BFS and traversal practice.',
    type: 'special',
    status: 'completed',
    problemSlugs: ['level-order-binary-tree', 'search-in-sorted-array'],
    startsOffsetMinutes: -1440,
    endsOffsetMinutes: -1320,
    penalty: 20,
  },
];

const participantSeeds = [
  {
    contestSlug: 'binary-search-blitz',
    userEmail: 'user@codemastery.com',
    score: 80,
    rank: 1,
    total_time: 900,
    penalty: 0,
    problems_solved: 1,
    problems_attempted: 2,
    status: 'participating',
  },
  {
    contestSlug: 'tree-traversal-showdown',
    userEmail: 'user@codemastery.com',
    score: 260,
    rank: 1,
    total_time: 1800,
    penalty: 120,
    problems_solved: 2,
    problems_attempted: 2,
    status: 'finished',
  },
];

const ensureUser = async (userSeed) => {
  const passwordHash = await bcrypt.hash(userSeed.password, 10);
  const [user, created] = await User.findOrCreate({
    where: { email: userSeed.email },
    defaults: {
      email: userSeed.email,
      username: userSeed.username,
      password_hash: passwordHash,
      role: userSeed.role,
      bio: userSeed.bio,
      avatar: avatarFor(userSeed.username),
      is_active: true,
    },
  });

  if (!created) {
    await user.update({
      username: userSeed.username,
      password_hash: passwordHash,
      role: userSeed.role,
      bio: userSeed.bio,
      avatar: avatarFor(userSeed.username),
      is_active: true,
    });
  }

  return user;
};

const ensureProblem = async (problemSeed, createdBy) => {
  const payload = {
    title: problemSeed.title,
    slug: problemSeed.slug,
    description: problemSeed.description,
    difficulty: problemSeed.difficulty,
    tags: problemSeed.tags,
    constraints: problemSeed.constraints,
    examples: problemSeed.examples,
    test_cases: problemSeed.test_cases,
    hidden_test_cases: problemSeed.hidden_test_cases,
    starter_code: problemSeed.starter_code,
    time_limit: 2000,
    memory_limit: 256,
    points: problemSeed.points,
    hints: problemSeed.hints,
    solution: problemSeed.solution,
    status: 'published',
    created_by: createdBy.id,
  };

  const [problem, created] = await Problem.findOrCreate({
    where: { slug: problemSeed.slug },
    defaults: payload,
  });

  if (!created) {
    await problem.update(payload);
  }

  return problem;
};

const ensureContest = async (contestSeed, createdBy, problemsBySlug) => {
  const now = Date.now();
  const startTime = new Date(now + contestSeed.startsOffsetMinutes * 60 * 1000);
  const endTime = new Date(now + contestSeed.endsOffsetMinutes * 60 * 1000);
  const contestProblems = contestSeed.problemSlugs
    .map((slug) => problemsBySlug.get(slug))
    .filter(Boolean);

  const payload = {
    title: contestSeed.title,
    slug: contestSeed.slug,
    description: contestSeed.description,
    start_time: startTime,
    end_time: endTime,
    duration: Math.max(15, Math.round((endTime.getTime() - startTime.getTime()) / 60000)),
    problems: contestProblems.map((problem) => problem.id),
    rules: JSON.stringify([
      'Contest uses testcase-weighted scoring.',
      'Wrong answers add a time penalty.',
      'Use the seeded learner account to verify join and submit flows.',
    ]),
    scoring: {
      mode: 'testcase_weighted',
      seeded: true,
    },
    penalty: contestSeed.penalty,
    max_participants: 500,
    visibility: 'public',
    contest_type: contestSeed.type,
    prizes:
      contestSeed.status === 'completed'
        ? { first: 'Mock Offer Shortlist', second: 'Interview Fast Track', third: 'Leaderboard Badge' }
        : null,
    created_by: createdBy.id,
    status: contestSeed.status,
  };

  const [contest, created] = await Contest.findOrCreate({
    where: { slug: contestSeed.slug },
    defaults: payload,
  });

  if (!created) {
    await contest.update(payload);
  }

  return contest;
};

const ensureParticipant = async (participantSeed, usersByEmail, contestsBySlug) => {
  const user = usersByEmail.get(participantSeed.userEmail);
  const contest = contestsBySlug.get(participantSeed.contestSlug);
  if (!user || !contest) {
    return null;
  }

  const defaults = {
    contest_id: contest.id,
    user_id: user.id,
    score: participantSeed.score,
    rank: participantSeed.rank,
    total_time: participantSeed.total_time,
    penalty: participantSeed.penalty,
    problems_solved: participantSeed.problems_solved,
    problems_attempted: participantSeed.problems_attempted,
    status: participantSeed.status,
    joined_at: new Date(Math.min(Date.now(), new Date(contest.start_time).getTime() + 5 * 60 * 1000)),
    finished_at: participantSeed.status === 'finished' ? new Date(contest.end_time) : null,
  };

  const [participant, created] = await ContestParticipant.findOrCreate({
    where: {
      contest_id: contest.id,
      user_id: user.id,
    },
    defaults,
  });

  if (!created) {
    await participant.update(defaults);
  }

  return participant;
};

const seed = async () => {
  await syncDatabase(false);

  await sequelize.transaction(async () => {
    const usersByEmail = new Map();
    for (const userSeed of seedUsers) {
      const user = await ensureUser(userSeed);
      usersByEmail.set(user.email, user);
    }

    const interviewer = usersByEmail.get('interviewer@codemastery.com');

    const problemsBySlug = new Map();
    for (const problemSeed of problemSeeds) {
      const problem = await ensureProblem(problemSeed, interviewer);
      problemsBySlug.set(problemSeed.slug, problem);
    }

    const contestsBySlug = new Map();
    for (const contestSeed of contestSeeds) {
      const contest = await ensureContest(contestSeed, interviewer, problemsBySlug);
      contestsBySlug.set(contestSeed.slug, contest);
    }

    for (const contest of contestsBySlug.values()) {
      const participantCount = participantSeeds.filter((seedEntry) => seedEntry.contestSlug === contest.slug).length;
      await contest.update({ participants_count: participantCount });
    }

    for (const participantSeed of participantSeeds) {
      await ensureParticipant(participantSeed, usersByEmail, contestsBySlug);
    }
  });

  console.log('Seeded demo users, published problems, contests, and participant snapshots.');
};

seed()
  .catch((error) => {
    console.error('Failed to seed contests and tests:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
