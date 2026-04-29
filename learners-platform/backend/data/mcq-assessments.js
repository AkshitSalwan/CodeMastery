// MCQ Assessments for each topic
// Each topic has multiple MCQs covering key concepts and patterns

const mcqAssessments = {
  // Topic 1: Arrays
  'arrays': [
    {
      id: 'arrays-mcq-1',
      type: 'mcq',
      title: 'Two Pointer Technique',
      prompt: 'When working with sorted arrays, which scenario is NOT ideal for the two-pointer technique?',
      focusArea: 'Arrays',
      options: [
        'Finding two elements that sum to a target',
        'Counting pairs with maximum distance',
        'Finding duplicate elements in an unsorted array',
        'Removing duplicates while maintaining order'
      ],
      correctOptionIndex: 2,
      explanation: 'The two-pointer technique works best with sorted arrays. For finding duplicates in unsorted arrays, a hash set is more appropriate. Two pointers are ideal when you need to work from both ends or when the array is sorted.'
    },
    {
      id: 'arrays-mcq-2',
      type: 'mcq',
      title: 'Sliding Window Pattern',
      prompt: 'What is the key advantage of the sliding window approach for substring problems?',
      focusArea: 'Arrays',
      options: [
        'It guarantees finding the lexicographically smallest substring',
        'It reduces time complexity from O(n²) to O(n) by avoiding redundant comparisons',
        'It works better on Unicode characters than ASCII',
        'It automatically handles negative numbers in the array'
      ],
      correctOptionIndex: 1,
      explanation: 'The sliding window technique avoids recalculating the entire window for each position. Instead of checking every possible substring (O(n²)), we expand and contract the window efficiently (O(n)).'
    },
    {
      id: 'arrays-mcq-3',
      type: 'mcq',
      title: 'Prefix Sum Optimization',
      prompt: 'How does the prefix sum technique help with range queries?',
      focusArea: 'Arrays',
      options: [
        'It sorts the array in-place without extra space',
        'It allows calculating sum of any range in O(1) after O(n) preprocessing',
        'It automatically finds the maximum element',
        'It eliminates the need for sorting'
      ],
      correctOptionIndex: 1,
      explanation: 'Prefix sum preprocessing stores cumulative sums, enabling O(1) range sum queries: sum(i,j) = prefix[j] - prefix[i-1]. This is crucial for competitive programming.'
    },
    {
      id: 'arrays-mcq-4',
      type: 'mcq',
      title: 'Kadane\'s Algorithm',
      prompt: 'What does Kadane\'s algorithm compute in O(n) time?',
      focusArea: 'Arrays',
      options: [
        'The longest increasing subsequence',
        'The maximum subarray sum',
        'The number of inversions in an array',
        'The median of an array'
      ],
      correctOptionIndex: 1,
      explanation: 'Kadane\'s algorithm maintains the maximum sum ending at each position, computing the maximum subarray sum in a single O(n) pass. This is more efficient than checking all possible subarrays.'
    },
    {
      id: 'arrays-mcq-5',
      type: 'mcq',
      title: 'Hash Map in Arrays',
      prompt: 'Which array problem is most efficiently solved using a hash map?',
      focusArea: 'Arrays',
      options: [
        'Sorting an array in ascending order',
        'Finding if two numbers sum to a target value',
        'Finding the median of an array',
        'Rotating an array by k positions'
      ],
      correctOptionIndex: 1,
      explanation: 'Hash maps enable O(1) lookup, making Two Sum problems efficient: O(n) time instead of O(n log n) with sorting. For each number x, check if (target - x) exists in the map.'
    }
  ],

  // Topic 2: Linked Lists
  'linked-lists': [
    {
      id: 'll-mcq-1',
      type: 'mcq',
      title: 'Floyd\'s Cycle Detection',
      prompt: 'How does Floyd\'s cycle detection (tortoise and hare) work?',
      focusArea: 'Linked Lists',
      options: [
        'It uses extra space to store all visited nodes',
        'Two pointers move at different speeds; if they meet, a cycle exists',
        'It reverses the list to check for cycles',
        'It sorts the node values to detect duplicates'
      ],
      correctOptionIndex: 1,
      explanation: 'Floyd\'s algorithm uses O(1) space with a slow pointer (1 step) and fast pointer (2 steps). They must meet if a cycle exists, proving the algorithm works perfectly for linked lists.'
    },
    {
      id: 'll-mcq-2',
      type: 'mcq',
      title: 'Reversing a Linked List',
      prompt: 'What is the time complexity of reversing a singly linked list iteratively?',
      focusArea: 'Linked Lists',
      options: [
        'O(n log n)',
        'O(n²)',
        'O(n)',
        'O(log n)'
      ],
      correctOptionIndex: 2,
      explanation: 'Iterative reversal visits each node once while updating pointers. This is O(n) time and O(1) space - optimal for linked lists. Recursive reversal is also O(n) but uses O(n) call stack.'
    },
    {
      id: 'll-mcq-3',
      type: 'mcq',
      title: 'Finding Middle of Linked List',
      prompt: 'Using two pointers, how do you find the middle of a linked list in O(n) time?',
      focusArea: 'Linked Lists',
      options: [
        'Fast pointer moves 2 steps, slow pointer moves 1 step; stop when fast reaches end',
        'Count total nodes first, then traverse to middle',
        'Use recursion with a counter',
        'Sort the list and find the median'
      ],
      correctOptionIndex: 0,
      explanation: 'When the fast pointer reaches the end, the slow pointer is at the middle. This works in O(n) time with O(1) space and only requires a single traversal.'
    },
    {
      id: 'll-mcq-4',
      type: 'mcq',
      title: 'Merging Sorted Linked Lists',
      prompt: 'What is the space complexity of merging two sorted linked lists?',
      focusArea: 'Linked Lists',
      options: [
        'O(n)',
        'O(n log n)',
        'O(1)',
        'O(2^n)'
      ],
      correctOptionIndex: 2,
      explanation: 'Merging sorted linked lists can be done in-place by adjusting pointers only. No extra space (except for the output list if not counted) is needed, making it O(1) space complexity.'
    },
    {
      id: 'll-mcq-5',
      type: 'mcq',
      title: 'LRU Cache Implementation',
      prompt: 'Why is a doubly linked list essential for implementing an LRU cache?',
      focusArea: 'Linked Lists',
      options: [
        'It allows faster sorting of nodes',
        'It enables O(1) deletion from the middle and moving nodes to front/back',
        'It uses less memory than arrays',
        'It automatically prevents duplicate values'
      ],
      correctOptionIndex: 1,
      explanation: 'LRU caches need O(1) deletion and reordering. Doubly linked lists allow this: remove from middle and move to front/back. Combined with a hash map, all operations are O(1).'
    }
  ],

  // Topic 3: Trees
  'trees': [
    {
      id: 'trees-mcq-1',
      type: 'mcq',
      title: 'Binary Search Tree Property',
      prompt: 'What defines a valid Binary Search Tree?',
      focusArea: 'Trees',
      options: [
        'Left child < parent < right child at each node',
        'All left children are less than their parent',
        'Left subtree < node < right subtree at ALL nodes',
        'Parent is always greater than both children'
      ],
      correctOptionIndex: 2,
      explanation: 'BST property applies recursively: the ENTIRE left subtree must be less than the node, and the ENTIRE right subtree must be greater. This is crucial for validating BSTs.'
    },
    {
      id: 'trees-mcq-2',
      type: 'mcq',
      title: 'Tree Traversal Orders',
      prompt: 'Which traversal order visits nodes in sorted order for a Binary Search Tree?',
      focusArea: 'Trees',
      options: [
        'Pre-order',
        'Post-order',
        'In-order',
        'Level-order'
      ],
      correctOptionIndex: 2,
      explanation: 'In-order traversal (Left, Root, Right) of a BST produces sorted sequence. Pre-order gives root first, post-order gives root last, level-order goes by depth.'
    },
    {
      id: 'trees-mcq-3',
      type: 'mcq',
      title: 'AVL Tree Balancing',
      prompt: 'What problem do AVL trees solve that regular BSTs have?',
      focusArea: 'Trees',
      options: [
        'They store duplicate values efficiently',
        'They prevent skewed trees by maintaining balance (height difference ≤ 1)',
        'They automatically sort data during insertion',
        'They reduce memory usage'
      ],
      correctOptionIndex: 1,
      explanation: 'Regular BSTs can become skewed (like linked lists), giving O(n) search. AVL trees rebalance to maintain height difference ≤ 1 between subtrees, guaranteeing O(log n) operations.'
    },
    {
      id: 'trees-mcq-4',
      type: 'mcq',
      title: 'Tree Depth vs Breadth Search',
      prompt: 'When solving tree problems, when is DFS preferred over BFS?',
      focusArea: 'Trees',
      options: [
        'Always, because DFS is faster',
        'When finding the shortest path between nodes',
        'When checking path-based properties or when memory is limited',
        'When you need to visit nodes level by level'
      ],
      correctOptionIndex: 2,
      explanation: 'DFS uses O(h) space (height) vs BFS O(w) space (width). For finding paths, checking ancestor properties, or when width is large, DFS is more efficient. BFS is better for level-based or shortest path problems.'
    },
    {
      id: 'trees-mcq-5',
      type: 'mcq',
      title: 'Lowest Common Ancestor (LCA)',
      prompt: 'What\'s the efficient approach to find LCA in a Binary Search Tree?',
      focusArea: 'Trees',
      options: [
        'Store all paths to root, compare them',
        'Use DFS to explore all branches',
        'Start from root and move left/right based on BST property until both values are found',
        'Store parent pointers and traverse backward'
      ],
      correctOptionIndex: 2,
      explanation: 'In a BST, if both values are < node, go left. If both > node, go right. Otherwise, that node is the LCA. This uses BST properties to find it in O(log n) average time.'
    }
  ],

  // Topic 4: Graphs
  'graphs': [
    {
      id: 'graphs-mcq-1',
      type: 'mcq',
      title: 'BFS vs DFS Application',
      prompt: 'Which graph search is best for finding the shortest path in an unweighted graph?',
      focusArea: 'Graphs',
      options: [
        'DFS because it explores deeply',
        'BFS because it explores level by level, guaranteeing shortest path',
        'They\'re equally efficient',
        'Dijkstra\'s algorithm always'
      ],
      correctOptionIndex: 1,
      explanation: 'BFS explores nodes level by level. The first time you reach a destination node in BFS guarantees the shortest path (minimum edges) in unweighted graphs. DFS doesn\'t guarantee this.'
    },
    {
      id: 'graphs-mcq-2',
      type: 'mcq',
      title: 'Detecting Cycles in Graphs',
      prompt: 'How do you detect a cycle in a directed graph?',
      focusArea: 'Graphs',
      options: [
        'Count edges; if edges > nodes, there\'s a cycle',
        'Use DFS and track back edges (edge to an ancestor)',
        'Sort topologically; if you can\'t sort all nodes, there\'s a cycle',
        'Check if graph is connected'
      ],
      correctOptionIndex: 1,
      explanation: 'During DFS, if you visit a node that\'s already in the current recursion stack, it\'s a back edge indicating a cycle. Topological sort also works: acyclic graphs have valid topological orderings.'
    },
    {
      id: 'graphs-mcq-3',
      type: 'mcq',
      title: 'Dijkstra\'s Algorithm',
      prompt: 'When is Dijkstra\'s algorithm NOT suitable?',
      focusArea: 'Graphs',
      options: [
        'When all edge weights are positive',
        'When finding shortest path from one source',
        'When there are negative weight edges',
        'When the graph is sparse'
      ],
      correctOptionIndex: 2,
      explanation: 'Dijkstra\'s assumes all weights are non-negative. With negative weights, use Bellman-Ford algorithm instead. Dijkstra\'s greedy approach fails with negative weights because it can\'t backtrack.'
    },
    {
      id: 'graphs-mcq-4',
      type: 'mcq',
      title: 'Minimum Spanning Tree',
      prompt: 'Which algorithm finds MST by greedily selecting the smallest edge that doesn\'t create a cycle?',
      focusArea: 'Graphs',
      options: [
        'DFS',
        'Prim\'s algorithm',
        'Kruskal\'s algorithm',
        'Topological sort'
      ],
      correctOptionIndex: 2,
      explanation: 'Kruskal\'s sorts edges by weight and greedily adds them if they don\'t create a cycle (using Union-Find). Prim\'s grows from a node, always adding the minimum edge to an unvisited node.'
    },
    {
      id: 'graphs-mcq-5',
      type: 'mcq',
      title: 'Topological Sorting',
      prompt: 'Topological sorting is primarily used for which type of problem?',
      focusArea: 'Graphs',
      options: [
        'Finding shortest paths',
        'Detecting cycles in weighted graphs',
        'Ordering tasks with dependencies in a DAG',
        'Finding connected components'
      ],
      correctOptionIndex: 2,
      explanation: 'Topological sort orders vertices so that for every directed edge u→v, u appears before v. It\'s essential for task scheduling, dependency resolution, and only works on DAGs (Directed Acyclic Graphs).'
    }
  ],

  // Topic 5: Dynamic Programming
  'dynamic-programming': [
    {
      id: 'dp-mcq-1',
      type: 'mcq',
      title: 'Overlapping Subproblems',
      prompt: 'What\'s the key characteristic that makes DP applicable to a problem?',
      focusArea: 'Dynamic Programming',
      options: [
        'The problem is always recursive',
        'Overlapping subproblems and optimal substructure exist',
        'The input is always sorted',
        'The problem requires a greedy approach'
      ],
      correctOptionIndex: 1,
      explanation: 'DP applies when: (1) Optimal solution built from optimal subproblems, (2) Same subproblems are solved repeatedly. Without overlapping subproblems, DP gains no advantage.'
    },
    {
      id: 'dp-mcq-2',
      type: 'mcq',
      title: 'Memoization vs Tabulation',
      prompt: 'What\'s the main difference between memoization and tabulation?',
      focusArea: 'Dynamic Programming',
      options: [
        'Memoization is top-down recursive; tabulation is bottom-up iterative',
        'Memoization is always faster',
        'Tabulation requires more memory',
        'They solve different types of problems'
      ],
      correctOptionIndex: 0,
      explanation: 'Memoization: recursive with caching (top-down). Tabulation: iterative with table (bottom-up). Both solve DP problems; choose based on problem structure and language constraints.'
    },
    {
      id: 'dp-mcq-3',
      type: 'mcq',
      title: 'Longest Common Subsequence',
      prompt: 'For LCS of two strings, what\'s the recurrence relation?',
      focusArea: 'Dynamic Programming',
      options: [
        'dp[i][j] = max(dp[i-1][j], dp[i][j-1]) if s1[i] != s2[j]',
        'dp[i][j] = 1 + dp[i-1][j-1] if s1[i] == s2[j]',
        'Both (1) and (2) depending on character match',
        'dp[i][j] = dp[i-1][j-1]'
      ],
      correctOptionIndex: 2,
      explanation: 'When characters match: dp[i][j] = 1 + dp[i-1][j-1]. When they don\'t: dp[i][j] = max(dp[i-1][j], dp[i][j-1]). This builds the longest matching subsequence efficiently.'
    },
    {
      id: 'dp-mcq-4',
      type: 'mcq',
      title: '0-1 Knapsack Problem',
      prompt: 'Why can greedy approach (taking highest value/weight ratio) fail for 0-1 Knapsack?',
      focusArea: 'Dynamic Programming',
      options: [
        'Because we can\'t take fractional items in 0-1 knapsack',
        'Because we need optimal substructure property',
        'Because the greedy choice may exclude better combinations',
        'Because weights are always positive'
      ],
      correctOptionIndex: 2,
      explanation: 'Greedy can\'t see future combinations. Example: high ratio item prevents fitting multiple smaller items with better total value. DP considers all combinations, guaranteeing optimality.'
    },
    {
      id: 'dp-mcq-5',
      type: 'mcq',
      title: 'Edit Distance (Levenshtein)',
      prompt: 'What operations does Edit Distance allow?',
      focusArea: 'Dynamic Programming',
      options: [
        'Only insertions',
        'Only deletions and substitutions',
        'Insertions, deletions, and substitutions (all cost 1)',
        'Only substitutions'
      ],
      correctOptionIndex: 2,
      explanation: 'Edit Distance allows three operations with equal cost: insert a character, delete a character, or substitute a character. DP computes minimum operations to transform one string to another.'
    }
  ],

  // Topic 6: JavaScript
  'javascript': [
    {
      id: 'js-mcq-1',
      type: 'mcq',
      title: 'JavaScript Closures',
      prompt: 'What does a closure in JavaScript allow?',
      focusArea: 'JavaScript',
      options: [
        'Functions to run faster',
        'Functions to access variables from their outer scope even after the outer function returns',
        'Preventing variable shadowing',
        'Automatic garbage collection'
      ],
      correctOptionIndex: 1,
      explanation: 'Closures let functions remember the lexical scope in which they were created. This is powerful for data privacy, callbacks, and functional programming patterns in JavaScript.'
    },
    {
      id: 'js-mcq-2',
      type: 'mcq',
      title: 'Async/Await vs Promises',
      prompt: 'What\'s the main advantage of async/await over traditional promises?',
      focusArea: 'JavaScript',
      options: [
        'It\'s faster',
        'It makes asynchronous code look and behave more like synchronous code, easier to read',
        'It doesn\'t need try-catch blocks',
        'It prevents all callback issues'
      ],
      correctOptionIndex: 1,
      explanation: 'async/await is syntactic sugar over promises. It makes async code look synchronous and linear, making it easier to understand flow and reason about error handling with try-catch.'
    },
    {
      id: 'js-mcq-3',
      type: 'mcq',
      title: 'Event Loop in JavaScript',
      prompt: 'How does JavaScript handle asynchronous operations with only one thread?',
      focusArea: 'JavaScript',
      options: [
        'JavaScript creates multiple threads automatically',
        'The event loop manages callbacks using the call stack and callback queue',
        'Asynchronous operations block the main thread',
        'JavaScript doesn\'t support true asynchronous programming'
      ],
      correctOptionIndex: 1,
      explanation: 'The event loop checks if the call stack is empty, then moves callbacks from the callback queue to execute. This enables non-blocking I/O and timers without threads.'
    },
    {
      id: 'js-mcq-4',
      type: 'mcq',
      title: 'Array Methods: map vs forEach',
      prompt: 'What\'s the key difference between map() and forEach()?',
      focusArea: 'JavaScript',
      options: [
        'map() is faster',
        'forEach() is slower but easier to read',
        'map() returns a new array; forEach() doesn\'t return anything (undefined)',
        'They are identical'
      ],
      correctOptionIndex: 2,
      explanation: 'map() returns a new transformed array, great for data transformation. forEach() performs side effects and returns undefined. Use map() for transformations, forEach() for operations.'
    },
    {
      id: 'js-mcq-5',
      type: 'mcq',
      title: 'Prototypal Inheritance',
      prompt: 'What is the purpose of the prototype chain in JavaScript?',
      focusArea: 'JavaScript',
      options: [
        'To prevent object creation',
        'To enable property lookup: if not on object, look on prototype, then prototype\'s prototype, etc.',
        'To make all objects identical',
        'To automatically call constructors'
      ],
      correctOptionIndex: 1,
      explanation: 'The prototype chain enables inheritance. When accessing a property, JS looks on the object, then its prototype, then up the chain. This allows sharing methods without duplication.'
    }
  ],

  // Topic 7: React
  'react': [
    {
      id: 'react-mcq-1',
      type: 'mcq',
      title: 'React Functional vs Class Components',
      prompt: 'What\'s a key advantage of functional components with hooks over class components?',
      focusArea: 'React',
      options: [
        'Class components have less boilerplate',
        'Functional components allow sharing stateful logic without inheritance or render props',
        'Class components are always faster',
        'Functional components support lifecycle better'
      ],
      correctOptionIndex: 1,
      explanation: 'Hooks enable sharing logic through custom hooks, eliminating complex patterns like render props or HOCs. Functional components are more composable and easier to test.'
    },
    {
      id: 'react-mcq-2',
      type: 'mcq',
      title: 'useEffect Dependencies',
      prompt: 'What does an empty dependency array [] mean in useEffect?',
      focusArea: 'React',
      options: [
        'The effect runs on every render',
        'The effect runs only once, after initial render (like componentDidMount)',
        'The effect never runs',
        'The effect runs when props change'
      ],
      correctOptionIndex: 1,
      explanation: 'An empty dependency array means the effect has no dependencies, so it runs once after mount. No dependencies array means it runs every render. This is crucial for preventing unnecessary effects.'
    },
    {
      id: 'react-mcq-3',
      type: 'mcq',
      title: 'React Keys in Lists',
      prompt: 'Why are keys important when rendering lists in React?',
      focusArea: 'React',
      options: [
        'They improve rendering performance',
        'They help React identify which items have changed, preserving component state and DOM nodes',
        'They automatically sort the list',
        'They prevent duplicate rendering'
      ],
      correctOptionIndex: 1,
      explanation: 'Keys help React match old elements to new ones. Without keys, React might reuse DOM nodes incorrectly, causing bugs. Using array index as key can cause issues with reordering.'
    },
    {
      id: 'react-mcq-4',
      type: 'mcq',
      title: 'useState Hook',
      prompt: 'Why can\'t you call useState conditionally inside an if statement?',
      focusArea: 'React',
      options: [
        'It\'s not actually restricted',
        'React relies on call order; conditional calls break the hook ordering',
        'It causes memory leaks',
        'State won\'t update properly'
      ],
      correctOptionIndex: 1,
      explanation: 'React identifies hooks by their call order. If you call useState conditionally, the order might change on re-renders, causing hooks to mismatch with wrong state values. Always call hooks at the top level.'
    },
    {
      id: 'react-mcq-5',
      type: 'mcq',
      title: 'Context API vs Props',
      prompt: 'When should you use Context API instead of passing props?',
      focusArea: 'React',
      options: [
        'Always use Context instead of props',
        'Context avoids prop drilling for deeply nested components but should be used carefully to avoid over-rendering',
        'Props are always better',
        'Only use Context for global state'
      ],
      correctOptionIndex: 1,
      explanation: 'Context eliminates prop drilling but context consumers re-render when context value changes. Use it for truly global state (theme, auth) but be mindful of performance implications.'
    }
  ],

  // Topic 8: System Design
  'system-design': [
    {
      id: 'sd-mcq-1',
      type: 'mcq',
      title: 'Horizontal vs Vertical Scaling',
      prompt: 'What\'s the main difference between horizontal and vertical scaling?',
      focusArea: 'System Design',
      options: [
        'Horizontal is always faster',
        'Horizontal: add more machines; Vertical: add more CPU/RAM to existing machine',
        'They\'re the same thing',
        'Vertical is better for databases'
      ],
      correctOptionIndex: 1,
      explanation: 'Horizontal scaling (adding servers) is more complex but handles failures better. Vertical scaling (bigger machine) is simpler but hits hardware limits. Production systems use both strategically.'
    },
    {
      id: 'sd-mcq-2',
      type: 'mcq',
      title: 'Caching Strategy',
      prompt: 'What\'s the purpose of caching in system design?',
      focusArea: 'System Design',
      options: [
        'To reduce database queries and improve response time',
        'To store permanent data',
        'To replace databases',
        'To increase complexity'
      ],
      correctOptionIndex: 0,
      explanation: 'Caching stores frequently accessed data in fast memory (Redis, Memcached). It reduces database load and latency. Common strategies: write-through, write-back, cache-aside.'
    },
    {
      id: 'sd-mcq-3',
      type: 'mcq',
      title: 'Load Balancing',
      prompt: 'What does a load balancer do?',
      focusArea: 'System Design',
      options: [
        'Reduces the weight of data',
        'Distributes incoming requests across multiple servers for even load',
        'Encrypts data in transit',
        'Sorts data by priority'
      ],
      correctOptionIndex: 1,
      explanation: 'Load balancers distribute traffic using strategies like round-robin, least connections, or hash-based. They enable horizontal scaling and provide failover if a server goes down.'
    },
    {
      id: 'sd-mcq-4',
      type: 'mcq',
      title: 'Database Replication',
      prompt: 'What advantage does master-slave replication provide?',
      focusArea: 'System Design',
      options: [
        'It increases write throughput',
        'It enables read scaling and provides redundancy in case master fails',
        'It reduces storage requirements',
        'It speeds up single-user queries'
      ],
      correctOptionIndex: 1,
      explanation: 'Master-slave replication has one master (writes) and slaves (read replicas). Reads scale across slaves, and if master fails, a slave can be promoted. Trade-off: eventual consistency.'
    },
    {
      id: 'sd-mcq-5',
      type: 'mcq',
      title: 'CAP Theorem',
      prompt: 'In the CAP theorem, what must distributed systems sacrifice?',
      focusArea: 'System Design',
      options: [
        'All three are always possible',
        'At most one of Consistency, Availability, or Partition tolerance',
        'Exactly one of Consistency or Availability when partitioned',
        'Nothing; all three can coexist'
      ],
      correctOptionIndex: 2,
      explanation: 'CAP theorem: Consistency (all nodes see same data), Availability (system always responds), Partition tolerance (tolerates network splits). You can have at most 2. Most choose Availability + Partition tolerance (eventual consistency).'
    }
  ],

  // Topic 9: Strings
  'strings': [
    {
      id: 'strings-mcq-1',
      type: 'mcq',
      title: 'Pattern Matching Algorithms',
      prompt: 'What advantage does KMP (Knuth-Morris-Pratt) have over naive pattern matching?',
      focusArea: 'Strings',
      options: [
        'KMP always uses less memory',
        'KMP avoids redundant comparisons using a failure function',
        'KMP is always faster for short patterns',
        'KMP supports multiple patterns simultaneously'
      ],
      correctOptionIndex: 1,
      explanation: 'KMP builds a failure function to skip redundant comparisons when a mismatch occurs. Naive string matching is O(n*m); KMP is O(n+m). Essential for large text searching.'
    },
    {
      id: 'strings-mcq-2',
      type: 'mcq',
      title: 'String Anagrams',
      prompt: 'What\'s an efficient way to check if two strings are anagrams?',
      focusArea: 'Strings',
      options: [
        'Compare sorted strings',
        'Use a frequency map to count characters in both strings',
        'Both approaches are equally efficient',
        'Check if they have the same length only'
      ],
      correctOptionIndex: 2,
      explanation: 'Both work: sorting is O(n log n), frequency map is O(n). Frequency map is technically better, but sorting is simpler to code. Choose based on context.'
    },
    {
      id: 'strings-mcq-3',
      type: 'mcq',
      title: 'Palindrome Checking',
      prompt: 'How do you efficiently check if a string is a palindrome considering only alphanumeric characters and ignoring case?',
      focusArea: 'Strings',
      options: [
        'Compare with reverse string',
        'Use two pointers: skip non-alphanumeric and compare after lowercasing',
        'Convert to array and sort',
        'Use recursion'
      ],
      correctOptionIndex: 1,
      explanation: 'Two-pointer approach is efficient: skip non-alphanumeric, compare characters case-insensitively. O(n) time, O(1) space. Better than creating reverse string which needs O(n) space.'
    },
    {
      id: 'strings-mcq-4',
      type: 'mcq',
      title: 'Longest Substring Without Repeating',
      prompt: 'How does the sliding window solve longest substring without repeating characters?',
      focusArea: 'Strings',
      options: [
        'It sorts characters',
        'It maintains a character frequency map and window boundaries',
        'It counts all possible substrings',
        'It uses recursion to explore all paths'
      ],
      correctOptionIndex: 1,
      explanation: 'Sliding window: expand right, add characters to map. When a duplicate is found, shrink left until duplicate is removed. Track maximum window size. O(n) time, O(1) space (at most 26 letters).'
    },
    {
      id: 'strings-mcq-5',
      type: 'mcq',
      title: 'Group Anagrams',
      prompt: 'What\'s an efficient approach to group anagrams from an array of strings?',
      focusArea: 'Strings',
      options: [
        'Sort all strings individually and group by sorted form',
        'Create a map with sorted string as key',
        'Compare every pair of strings',
        'Use hash function on character frequencies'
      ],
      correctOptionIndex: 1,
      explanation: 'Sorted string as key works: "ate", "eat", "tea" all sort to "aet", so group together. Or use character count as key. Both are O(n*k log k) where k is average string length.'
    }
  ],

  // Topic 10: Sorting
  'sorting': [
    {
      id: 'sort-mcq-1',
      type: 'mcq',
      title: 'Quick Sort Pivot Selection',
      prompt: 'Why does pivot selection matter in Quick Sort?',
      focusArea: 'Sorting',
      options: [
        'It doesn\'t affect performance',
        'Poor pivot selection can lead to O(n²) worst case; good selection maintains O(n log n)',
        'Only affects memory usage',
        'Random pivots always work best'
      ],
      correctOptionIndex: 1,
      explanation: 'If you always pick smallest/largest as pivot, array becomes unbalanced (like linked list), giving O(n²). Median-of-three or randomized pivot helps maintain O(n log n) average case.'
    },
    {
      id: 'sort-mcq-2',
      type: 'mcq',
      title: 'Stability in Sorting',
      prompt: 'What does "stable" sorting mean?',
      focusArea: 'Sorting',
      options: [
        'The algorithm doesn\'t use extra space',
        'Equal elements maintain their relative order from the original array',
        'The algorithm is fast',
        'It works for all data types'
      ],
      correctOptionIndex: 1,
      explanation: 'Merge Sort and Bubble Sort are stable. Quick Sort and Heap Sort aren\'t. Important when sorting objects by key: stability preserves order of equal elements, crucial for predictable results.'
    },
    {
      id: 'sort-mcq-3',
      type: 'mcq',
      title: 'Counting Sort',
      prompt: 'When is Counting Sort applicable?',
      focusArea: 'Sorting',
      options: [
        'Always, it\'s the fastest',
        'When elements are integers within a small range',
        'Only for small arrays',
        'Never, it\'s outdated'
      ],
      correctOptionIndex: 1,
      explanation: 'Counting Sort is O(n+k) where k is range. Beats O(n log n) when k is small. Unsuitable for large ranges or floats. Essential for specific scenarios, not general-purpose.'
    },
    {
      id: 'sort-mcq-4',
      type: 'mcq',
      title: 'Merge Sort Complexity',
      prompt: 'What\'s the space complexity of Merge Sort?',
      focusArea: 'Sorting',
      options: [
        'O(1)',
        'O(log n)',
        'O(n)',
        'O(n log n)'
      ],
      correctOptionIndex: 2,
      explanation: 'Merge Sort requires O(n) extra space for merging subarrays. Even optimized in-place variants need extra space. Trade-off: O(n) space but guaranteed O(n log n) time and stable.'
    },
    {
      id: 'sort-mcq-5',
      type: 'mcq',
      title: 'Radix Sort',
      prompt: 'How does Radix Sort achieve linear time complexity?',
      focusArea: 'Sorting',
      options: [
        'By comparing all pairs',
        'By sorting digits one by one (units, tens, hundreds...) using Counting Sort',
        'By using fast hardware',
        'It doesn\'t; it\'s still O(n log n)'
      ],
      correctOptionIndex: 1,
      explanation: 'Radix Sort processes each digit position separately using Counting Sort. For d digits and base b: O(d(n+b)). For fixed-size integers, this becomes O(n). Non-comparative sorting advantage.'
    }
  ],

  // Topic 11: Hash Tables
  'hash-tables': [
    {
      id: 'hash-mcq-1',
      type: 'mcq',
      title: 'Collision Resolution',
      prompt: 'What\'s the difference between chaining and open addressing for collision resolution?',
      focusArea: 'Hash Tables',
      options: [
        'Chaining is always faster',
        'Chaining uses linked lists at each bucket; open addressing finds another empty slot in the table',
        'They\'re identical',
        'Open addressing uses more memory'
      ],
      correctOptionIndex: 1,
      explanation: 'Chaining: separate chain per bucket, simple but memory overhead. Open addressing: linear/quadratic probing finds next slot, better cache locality but complex deletion. Trade-offs for different scenarios.'
    },
    {
      id: 'hash-mcq-2',
      type: 'mcq',
      title: 'Load Factor',
      prompt: 'What does load factor represent in a hash table?',
      focusArea: 'Hash Tables',
      options: [
        'The weight of the data stored',
        'The ratio of elements to table size; when high, collision increases, trigger resizing',
        'The speed of hashing',
        'Memory usage'
      ],
      correctOptionIndex: 1,
      explanation: 'Load factor = size / capacity. High load factor (0.7+) increases collisions and O(1) operations degrade. Hash tables resize when load factor exceeds threshold, maintaining performance.'
    },
    {
      id: 'hash-mcq-3',
      type: 'mcq',
      title: 'Hash Function Properties',
      prompt: 'What\'s the most critical property of a good hash function?',
      focusArea: 'Hash Tables',
      options: [
        'It\'s always fast',
        'It minimizes collisions by distributing keys uniformly',
        'It sorts keys automatically',
        'It uses cryptography'
      ],
      correctOptionIndex: 1,
      explanation: 'Good hash functions distribute keys evenly across buckets, minimizing collisions. Uniformity reduces clustering. Bad distribution makes chaining degrade to O(n) lookups, defeating hash table purpose.'
    },
    {
      id: 'hash-mcq-4',
      type: 'mcq',
      title: 'Why Hash Tables Have O(1) Average',
      prompt: 'Under what condition is O(1) lookup guaranteed in hash tables?',
      focusArea: 'Hash Tables',
      options: [
        'Always guaranteed',
        'When load factor is controlled and hash function distributes uniformly',
        'Only for integer keys',
        'Never guaranteed'
      ],
      correctOptionIndex: 1,
      explanation: 'O(1) is average case with good assumptions: uniform hash distribution and controlled load factor. Worst case is O(n) if all keys hash to same slot. Practical implementations maintain these assumptions.'
    },
    {
      id: 'hash-mcq-5',
      type: 'mcq',
      title: 'Hash Tables vs Trees',
      prompt: 'When would you prefer a tree (like balanced BST) over a hash table?',
      focusArea: 'Hash Tables',
      options: [
        'Trees are always better',
        'When you need sorted order, range queries, or worst-case O(log n) guarantees',
        'Hash tables are always preferred',
        'Never, hash tables dominate'
      ],
      correctOptionIndex: 1,
      explanation: 'Hash tables: O(1) average but no ordering, worse worst-case. Trees: O(log n) guaranteed, sorted order, range queries. Choose based on needs: speed vs ordering/structure.'
    }
  ],

  // Topic 12: Stacks & Queues
  'stacks-queues': [
    {
      id: 'sq-mcq-1',
      type: 'mcq',
      title: 'Stack Applications',
      prompt: 'Which problem is typically solved using a stack?',
      focusArea: 'Stacks & Queues',
      options: [
        'Finding the shortest path',
        'Matching parentheses and evaluating expressions',
        'Scheduling tasks fairly',
        'Sorting an array'
      ],
      correctOptionIndex: 1,
      explanation: 'Stacks (LIFO) excel at problems requiring backtracking: matching brackets, expression evaluation, DFS. Queue (FIFO) handles BFS and task scheduling where order matters.'
    },
    {
      id: 'sq-mcq-2',
      type: 'mcq',
      title: 'Queue Applications',
      prompt: 'Which scenario is ideal for a queue?',
      focusArea: 'Stacks & Queues',
      options: [
        'Undo/redo functionality',
        'Task scheduling, printer queue, BFS in graphs',
        'Recursion tracking',
        'Expression parsing'
      ],
      correctOptionIndex: 1,
      explanation: 'Queues (FIFO) handle: task scheduling (fairness), BFS exploration, printer jobs, customer service lines. First in, first out matches real-world queue behavior.'
    },
    {
      id: 'sq-mcq-3',
      type: 'mcq',
      title: 'Monotonic Stack',
      prompt: 'What problem does a monotonic stack solve efficiently?',
      focusArea: 'Stacks & Queues',
      options: [
        'Sorting arrays',
        'Finding next/previous greater element in O(n) instead of O(n²)',
        'Detecting cycles',
        'Parsing JSON'
      ],
      correctOptionIndex: 1,
      explanation: 'Monotonic stack maintains increasing/decreasing order. For each element, pop smaller elements (which found their next greater). O(n) solution to next greater element problem.'
    },
    {
      id: 'sq-mcq-4',
      type: 'mcq',
      title: 'Implementing Queue with Stacks',
      prompt: 'What\'s the space-time trade-off when implementing a queue using two stacks?',
      focusArea: 'Stacks & Queues',
      options: [
        'No trade-off, equivalent to a queue',
        'Dequeue can be amortized O(1) but requires reversing stack when empty',
        'Always O(n) for any operation',
        'Never works efficiently'
      ],
      correctOptionIndex: 1,
      explanation: 'Use two stacks: enqueue pushes to s1, dequeue pops from s2. When s2 is empty, reverse all of s1 to s2. Most operations are O(1); reversal is amortized O(1) per element.'
    },
    {
      id: 'sq-mcq-5',
      type: 'mcq',
      title: 'Valid Parentheses Problem',
      prompt: 'Why is stack ideal for the "valid parentheses" problem?',
      focusArea: 'Stacks & Queues',
      options: [
        'It\'s the fastest approach',
        'LIFO nature matches matching requirement: most recent opening must match current closing',
        'It uses less memory',
        'It automatically sorts brackets'
      ],
      correctOptionIndex: 1,
      explanation: 'Push opening brackets, pop on closing. If popped doesn\'t match or stack empty on closing, invalid. LIFO matches nesting structure of parentheses perfectly.'
    }
  ]
};

export default mcqAssessments;
