export const discussions = [
  {
    id: 1,
    problemId: "two-sum",
    author: {
      name: "Alice Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      role: "user"
    },
    title: "Optimal solution explanation",
    content: "Can someone explain the O(n) solution using hash maps? I'm struggling to understand how it works.",
    timestamp: "2024-01-15T10:30:00Z",
    upvotes: 12,
    replies: [
      {
        id: 101,
        author: {
          name: "Bob Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
          role: "interviewer"
        },
        content: "The hash map stores the complement of each number. For each number, check if target - num exists in the map. If yes, return indices.",
        timestamp: "2024-01-15T11:00:00Z",
        upvotes: 8
      }
    ]
  },
  {
    id: 2,
    problemId: "two-sum",
    author: {
      name: "Charlie Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      role: "user"
    },
    title: "Edge cases to consider",
    content: "What are some edge cases I should test for? I've been getting wrong answers on some test cases.",
    timestamp: "2024-01-14T15:20:00Z",
    upvotes: 5,
    replies: [
      {
        id: 201,
        author: {
          name: "Diana Prince",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
          role: "user"
        },
        content: "1. Empty array, 2. Single element, 3. Duplicate numbers, 4. Negative numbers, 5. Large numbers",
        timestamp: "2024-01-14T16:00:00Z",
        upvotes: 6
      }
    ]
  }
];