const learningTopics = [
  {
    id: 1,
    slug: 'javascript-foundations',
    title: 'JavaScript Foundations',
    description: 'Build confidence with variables, functions, arrays, objects, and modern ES syntax before you jump into bigger frameworks.',
    level: 'Beginner',
    duration: '4 weeks',
    lessons: 18,
    category: 'Frontend',
    featured: true,
    tags: ['JavaScript', 'ES6', 'Core Concepts'],
    outcomes: [
      'Understand JavaScript syntax and control flow',
      'Work confidently with arrays and objects',
      'Write reusable functions and modules'
    ],
    roadmap: [
      {
        phase: 'Week 1',
        title: 'Syntax and control flow',
        description: 'Get comfortable with variables, operators, loops, conditions, and common built-in types.'
      },
      {
        phase: 'Week 2',
        title: 'Functions and objects',
        description: 'Practice scope, closures, object patterns, and reusable utility functions.'
      },
      {
        phase: 'Week 3',
        title: 'Arrays and modern ES syntax',
        description: 'Use array methods, destructuring, spread syntax, and optional chaining effectively.'
      },
      {
        phase: 'Week 4',
        title: 'Async foundations',
        description: 'Understand promises, async/await, and how data flows through real front-end apps.'
      }
    ],
    problemCategories: ['Array', 'String', 'Hash Table', 'Stack'],
    recommendedProblemIds: ['1', '3', '9', '10'],
    practiceFocus: 'Use these warm-up problems to build the fast pattern-recognition you need for JavaScript interviews and everyday debugging.',
    resources: [
      {
        title: 'JavaScript Guide',
        source: 'MDN',
        type: 'Documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        description: 'A structured guide to the language with practical explanations and examples.'
      },
      {
        title: 'JavaScript Tutorial',
        source: 'GeeksforGeeks',
        type: 'Tutorial',
        url: 'https://www.geeksforgeeks.org/javascript-tutorial/',
        description: 'A broad beginner-friendly tutorial path for syntax, DOM basics, and practice.'
      }
    ]
  },
  {
    id: 2,
    slug: 'react-ui-development',
    title: 'React UI Development',
    description: 'Learn component-driven development, hooks, routing, and scalable UI composition so your interfaces feel deliberate instead of stitched together.',
    level: 'Intermediate',
    duration: '5 weeks',
    lessons: 22,
    category: 'Frontend',
    featured: true,
    tags: ['React', 'Hooks', 'Routing'],
    outcomes: [
      'Build reusable React components',
      'Manage state with hooks',
      'Create routed single-page applications'
    ],
    roadmap: [
      {
        phase: 'Week 1',
        title: 'Component mental model',
        description: 'Break interfaces into clean component boundaries and understand props-driven rendering.'
      },
      {
        phase: 'Week 2',
        title: 'State and events',
        description: 'Manage local state, event handlers, and controlled inputs without losing clarity.'
      },
      {
        phase: 'Week 3',
        title: 'Hooks and effects',
        description: 'Use hooks intentionally and separate UI state from side effects.'
      },
      {
        phase: 'Week 4-5',
        title: 'Routing and scalable UI composition',
        description: 'Build multi-page flows, shared layouts, and composable patterns that scale with the product.'
      }
    ],
    problemCategories: ['Array', 'String', 'Sorting', 'Stack'],
    recommendedProblemIds: ['3', '8', '9', '4'],
    practiceFocus: 'These problems strengthen the data manipulation and UI-state thinking that show up constantly in React work.',
    resources: [
      {
        title: 'Learn React',
        source: 'React Docs',
        type: 'Official Guide',
        url: 'https://react.dev/learn',
        description: 'The official modern learning path for components, hooks, state, and rendering.'
      },
      {
        title: 'React Tutorial',
        source: 'GeeksforGeeks',
        type: 'Tutorial',
        url: 'https://www.geeksforgeeks.org/reactjs/react/',
        description: 'A broad React refresher that pairs well with the official docs when you want more examples.'
      }
    ]
  },
  {
    id: 3,
    slug: 'node-api-engineering',
    title: 'Node API Engineering',
    description: 'Create REST APIs with routing, controllers, validation, and production-minded structure that stays maintainable as the project grows.',
    level: 'Intermediate',
    duration: '6 weeks',
    lessons: 24,
    category: 'Backend',
    featured: false,
    tags: ['Node.js', 'Express', 'REST API'],
    outcomes: [
      'Design API routes and controller layers',
      'Validate requests and handle errors cleanly',
      'Structure backend code for maintainability'
    ],
    roadmap: [
      {
        phase: 'Week 1-2',
        title: 'Express foundations',
        description: 'Understand routing, middleware, request lifecycles, and how to structure handlers.'
      },
      {
        phase: 'Week 3',
        title: 'Validation and error handling',
        description: 'Make APIs predictable with input validation, defensive checks, and clean response shapes.'
      },
      {
        phase: 'Week 4',
        title: 'Controllers and services',
        description: 'Move business logic out of route files and keep modules easy to test.'
      },
      {
        phase: 'Week 5-6',
        title: 'Production hardening',
        description: 'Add environment handling, logging boundaries, timeouts, and safer defaults.'
      }
    ],
    problemCategories: ['Hash Table', 'Graph', 'Array', 'Sorting'],
    recommendedProblemIds: ['1', '6', '8', '10'],
    practiceFocus: 'Backend interviews still test problem solving heavily, so these recommendations reinforce implementation speed and clean logic.',
    resources: [
      {
        title: 'Express Basic Routing',
        source: 'Express Docs',
        type: 'Official Guide',
        url: 'https://expressjs.com/en/starter/basic-routing.html',
        description: 'The official starting point for understanding how Express routes are structured.'
      },
      {
        title: 'Routing in Express.js',
        source: 'GeeksforGeeks',
        type: 'Tutorial',
        url: 'https://www.geeksforgeeks.org/node-js/what-is-routing-in-express/',
        description: 'A practical walkthrough of Express routing patterns with simple examples.'
      }
    ]
  },
  {
    id: 4,
    slug: 'data-structures-and-algorithms',
    title: 'Data Structures and Algorithms',
    description: 'Strengthen problem-solving with arrays, linked lists, trees, graphs, and the algorithmic patterns that power technical interviews.',
    level: 'Advanced',
    duration: '8 weeks',
    lessons: 30,
    category: 'Problem Solving',
    featured: true,
    tags: ['DSA', 'Algorithms', 'Interview Prep'],
    outcomes: [
      'Choose suitable data structures',
      'Apply algorithmic problem-solving patterns',
      'Improve interview readiness'
    ],
    roadmap: [
      {
        phase: 'Week 1-2',
        title: 'Arrays, strings, and hashing',
        description: 'Master the fast lookup and sliding-window patterns that appear constantly in interviews.'
      },
      {
        phase: 'Week 3-4',
        title: 'Trees and graphs',
        description: 'Practice traversal, recursion, BFS/DFS, and search strategies.'
      },
      {
        phase: 'Week 5-6',
        title: 'Stacks, queues, and intervals',
        description: 'Recognize structural patterns and simplify state-heavy problems.'
      },
      {
        phase: 'Week 7-8',
        title: 'Dynamic programming and review loops',
        description: 'Build intuition for subproblems and revisit weak areas with deliberate repetition.'
      }
    ],
    problemCategories: ['Array', 'String', 'Hash Table', 'Tree', 'Graph', 'Dynamic Programming', 'Sorting', 'Stack', 'Bit Manipulation'],
    recommendedProblemIds: ['1', '3', '5', '6', '7', '8', '11'],
    practiceFocus: 'This set is arranged to cover a balanced spread of core patterns before you move into harder variants.',
    resources: [
      {
        title: 'Introduction to Data Structures',
        source: 'GeeksforGeeks',
        type: 'Tutorial',
        url: 'https://www.geeksforgeeks.org/introduction-to-data-structures/',
        description: 'A clean entry point for revisiting what each data structure is good at and when to use it.'
      },
      {
        title: 'Searching Algorithms',
        source: 'GeeksforGeeks',
        type: 'Practice Guide',
        url: 'https://www.geeksforgeeks.org/dsa/searching-algorithms/',
        description: 'A focused guide to linear search, binary search, and the mindset behind choosing them.'
      }
    ]
  },
  {
    id: 5,
    slug: 'database-design-basics',
    title: 'Database Design Basics',
    description: 'Understand relational modeling, normalization, indexing, and query thinking so your data layer supports scale instead of fighting it.',
    level: 'Beginner',
    duration: '3 weeks',
    lessons: 14,
    category: 'Database',
    featured: false,
    tags: ['SQL', 'Schema Design', 'Indexes'],
    outcomes: [
      'Design clear relational schemas',
      'Write practical SQL queries',
      'Use indexing fundamentals effectively'
    ],
    roadmap: [
      {
        phase: 'Week 1',
        title: 'Tables, relationships, and keys',
        description: 'Understand entities, primary keys, foreign keys, and how data should relate.'
      },
      {
        phase: 'Week 2',
        title: 'Normalization and query thinking',
        description: 'Reduce duplication, model data clearly, and think through query paths before coding.'
      },
      {
        phase: 'Week 3',
        title: 'Indexes and performance basics',
        description: 'Learn where indexes help, where they hurt, and how schema decisions affect runtime behavior.'
      }
    ],
    problemCategories: ['Hash Table', 'Sorting', 'Graph', 'Math'],
    recommendedProblemIds: ['1', '2', '6', '8'],
    practiceFocus: 'These problems sharpen the data-shaping mindset that pairs well with schema design and query optimization work.',
    resources: [
      {
        title: 'SQL Tutorial',
        source: 'GeeksforGeeks',
        type: 'Tutorial',
        url: 'https://www.geeksforgeeks.org/sql-tutorial/',
        description: 'A full SQL refresher covering statements, joins, constraints, and practical querying.'
      },
      {
        title: 'DBMS Overview',
        source: 'GeeksforGeeks',
        type: 'Concept Guide',
        url: 'https://www.geeksforgeeks.org/dbms/dbms/',
        description: 'A good conceptual review of DBMS fundamentals, transactions, normalization, and design principles.'
      }
    ]
  },
  {
    id: 6,
    slug: 'system-design-starter',
    title: 'System Design Starter',
    description: 'Get introduced to scalability, caching, queues, load balancing, and reliable architectures in a way that builds real intuition.',
    level: 'Advanced',
    duration: '6 weeks',
    lessons: 20,
    category: 'Architecture',
    featured: false,
    tags: ['System Design', 'Scalability', 'Caching'],
    outcomes: [
      'Explain core system design tradeoffs',
      'Recognize scalable architecture patterns',
      'Break down large systems into components'
    ],
    roadmap: [
      {
        phase: 'Week 1',
        title: 'Systems thinking',
        description: 'Learn how to break products into services, data flows, and operational constraints.'
      },
      {
        phase: 'Week 2-3',
        title: 'Storage, caching, and queues',
        description: 'Use core building blocks intentionally instead of memorizing buzzwords.'
      },
      {
        phase: 'Week 4-5',
        title: 'Scalability and reliability',
        description: 'Reason about load, failure modes, availability, and fallback strategies.'
      },
      {
        phase: 'Week 6',
        title: 'Interview-style design walkthroughs',
        description: 'Practice structured discussions that turn vague prompts into concrete architectures.'
      }
    ],
    problemCategories: ['Graph', 'Tree', 'Sorting', 'Dynamic Programming'],
    recommendedProblemIds: ['5', '6', '7', '8'],
    practiceFocus: 'These algorithm problems build the decomposition and state-management habits that make system design explanations sharper.',
    resources: [
      {
        title: 'System Design Tutorial',
        source: 'GeeksforGeeks',
        type: 'Tutorial',
        url: 'https://www.geeksforgeeks.org/system-design/system-design-tutorial/',
        description: 'A broad system design roadmap with common building blocks, interview prompts, and architecture concepts.'
      },
      {
        title: 'AWS Well-Architected Framework',
        source: 'AWS Docs',
        type: 'Reference',
        url: 'https://docs.aws.amazon.com/wellarchitected/2023-10-03/framework/definitions.html',
        description: 'A practical reference for evaluating reliability, performance, cost, and operational tradeoffs.'
      }
    ]
  }
];

const learnersPlatformMeta = {
  title: 'Learning Hub',
  subtitle: 'Structured topic tracks with practice plans, curated reading, and fast ways to move from exploration to execution.',
  stats: {
    topics: learningTopics.length,
    featuredTracks: learningTopics.filter((topic) => topic.featured).length,
    categories: [...new Set(learningTopics.map((topic) => topic.category))].length
  }
};

module.exports = {
  learningTopics,
  learnersPlatformMeta,
};
