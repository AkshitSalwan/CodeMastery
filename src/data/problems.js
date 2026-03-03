export const problems = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    category: ['Array', 'Hash Table'],
    acceptanceRate: 47.3,
    submissions: 28945203,
    companies: ['Amazon', 'Apple', 'Google'],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index0 = 0, index1 = 1.',
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  return [];
}`,
      python: `def twoSum(nums, target):
    # Write your code here
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
    },
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'How about storing the numbers in a hash table and checking for the complement?',
    ],
    explanation: 'We can use a hash table to store the numbers we have seen and check if the complement exists.',
    rating: 4.5,
    ratingCount: 12543,
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order.',
    difficulty: 'Medium',
    category: ['Linked List', 'Math'],
    acceptanceRate: 32.4,
    submissions: 15234567,
    companies: ['Amazon', 'Microsoft', 'Apple'],
    constraints: [
      '2 <= l1.length, l2.length <= 100',
      '0 <= Node.val <= 9',
    ],
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807',
      },
    ],
    starterCode: {
      javascript: `function addTwoNumbers(l1, l2) {
  // Write your code here
  return null;
}`,
      python: `def addTwoNumbers(l1, l2):
    # Write your code here
    return None`,
      java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your code here
        return null;
    }
}`,
      cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Write your code here
        return nullptr;
    }
};`,
    },
    hints: [
      'Keep track of the carry using a variable and simulate the digits-by-digits sum starting from the head of list.',
    ],
    explanation: 'Traverse both lists simultaneously, handling the carry at each step.',
    rating: 4.3,
    ratingCount: 8932,
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    category: ['String', 'Sliding Window', 'Hash Table'],
    acceptanceRate: 33.5,
    submissions: 9834562,
    companies: ['Amazon', 'Bloomberg', 'Meta'],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your code here
  return 0;
}`,
      python: `def lengthOfLongestSubstring(s):
    # Write your code here
    return 0`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        return 0;
    }
};`,
    },
    hints: [
      'Use a sliding window approach to track the longest substring.',
      'Keep track of character indices in a hash map.',
    ],
    explanation: 'Use a sliding window with a hash map to track character positions.',
    rating: 4.6,
    ratingCount: 11256,
  },
  {
    id: '4',
    title: 'Best Time to Buy and Sell Stock',
    description: 'Given an array prices where prices[i] is the price of a given stock on the i-th day, maximize profit by choosing a single day to buy and a different day to sell.',
    difficulty: 'Easy',
    category: ['Array', 'Dynamic Programming'],
    acceptanceRate: 52.1,
    submissions: 18765432,
    companies: ['Amazon', 'Meta', 'Google'],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 5.',
      },
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your code here
  return 0;
}`,
      python: `def maxProfit(prices):
    # Write your code here
    return 0`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your code here
        return 0;
    }
};`,
    },
    hints: [
      'Track the minimum price so far and the maximum profit at each step.',
    ],
    explanation: 'Use a single pass to keep the minimum price seen and update the maximum profit.',
    rating: 4.4,
    ratingCount: 9567,
  },
  {
    id: '5',
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
    difficulty: 'Medium',
    category: ['Tree'],
    acceptanceRate: 61.2,
    submissions: 7654321,
    companies: ['Amazon', 'Microsoft'],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
    ],
    examples: [
      {
        input: 'root = [3,9,20,null,15,7]',
        output: '[[3],[9,20],[15,7]]',
        explanation: 'Traverse the tree level by level from left to right.',
      },
    ],
    starterCode: {
      javascript: `function levelOrder(root) {
  // Write your code here
  return [];
}`,
      python: `def levelOrder(root):
    # Write your code here
    return []`,
      java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        // Write your code here
        return {};
    }
};`,
    },
    hints: [
      'Use a queue to perform a breadth-first search (BFS).',
    ],
    explanation: 'Standard BFS where you process nodes level by level using a queue.',
    rating: 4.5,
    ratingCount: 7342,
  },
  {
    id: '6',
    title: 'Number of Islands',
    description: 'Given a 2D grid of 1s (land) and 0s (water), count the number of islands.',
    difficulty: 'Medium',
    category: ['Array', 'Graph'],
    acceptanceRate: 49.8,
    submissions: 13456789,
    companies: ['Amazon', 'Google', 'Microsoft'],
    constraints: [
      '1 <= m, n <= 300',
    ],
    examples: [
      {
        input: 'grid = [\n  [1,1,0,0,0],\n  [1,1,0,0,0],\n  [0,0,1,0,0],\n  [0,0,0,1,1]\n]',
        output: '3',
        explanation: 'There are three separate islands.',
      },
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
  // Write your code here
  return 0;
}`,
      python: `def numIslands(grid):
    # Write your code here
    return 0`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your code here
        return 0;
    }
};`,
    },
    hints: [
      'Use DFS or BFS to traverse each island and mark visited cells.',
    ],
    explanation: 'Iterate over the grid and run DFS/BFS when you see unvisited land to mark the whole island.',
    rating: 4.7,
    ratingCount: 15023,
  },
  {
    id: '7',
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps.',
    difficulty: 'Easy',
    category: ['Dynamic Programming'],
    acceptanceRate: 55.4,
    submissions: 11234567,
    companies: ['Amazon', 'Apple'],
    constraints: [
      '1 <= n <= 45',
    ],
    examples: [
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: 1+1+1, 1+2, 2+1.',
      },
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Write your code here
  return 0;
}`,
      python: `def climbStairs(n):
    # Write your code here
    return 0`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
};`,
    },
    hints: [
      'This is a Fibonacci-style dynamic programming problem.',
    ],
    explanation: 'Use DP where dp[i] = dp[i - 1] + dp[i - 2].',
    rating: 4.2,
    ratingCount: 8431,
  },
  {
    id: '8',
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.',
    difficulty: 'Medium',
    category: ['Array', 'Sorting'],
    acceptanceRate: 44.7,
    submissions: 9234567,
    companies: ['Amazon', 'Google', 'Uber'],
    constraints: [
      '1 <= intervals.length <= 10^4',
    ],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Intervals [1,3] and [2,6] overlap to form [1,6].',
      },
    ],
    starterCode: {
      javascript: `function merge(intervals) {
  // Write your code here
  return [];
}`,
      python: `def merge(intervals):
    # Write your code here
    return []`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your code here
        return new int[0][0];
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your code here
        return {};
    }
};`,
    },
    hints: [
      'Sort intervals by start time, then merge sequentially.',
    ],
    explanation: 'After sorting by start, iterate and merge overlapping intervals into an output list.',
    rating: 4.5,
    ratingCount: 10234,
  },
  {
    id: '9',
    title: 'Valid Parentheses',
    description: 'Given a string s containing parentheses, determine if the input string is valid.',
    difficulty: 'Easy',
    category: ['Stack', 'String'],
    acceptanceRate: 39.9,
    submissions: 14345678,
    companies: ['Amazon', 'Bloomberg'],
    constraints: [
      '1 <= s.length <= 10^4',
    ],
    examples: [
      {
        input: 's = \"()[]{}\"',
        output: 'true',
        explanation: 'All brackets are closed in the correct order.',
      },
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your code here
  return false;
}`,
      python: `def isValid(s):
    # Write your code here
    return False`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        return false;
    }
};`,
    },
    hints: [
      'Use a stack to push opening brackets and match them with closing brackets.',
    ],
    explanation: 'Use a stack and a map of matching pairs to validate the string.',
    rating: 4.1,
    ratingCount: 7654,
  },
  {
    id: '10',
    title: 'Single Number',
    description: 'Given a non-empty array of integers, every element appears twice except for one. Find that single one.',
    difficulty: 'Easy',
    category: ['Array', 'Bit Manipulation'],
    acceptanceRate: 67.2,
    submissions: 8567890,
    companies: ['Amazon', 'Microsoft'],
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
    ],
    examples: [
      {
        input: 'nums = [4,1,2,1,2]',
        output: '4',
        explanation: '4 is the only element that appears once.',
      },
    ],
    starterCode: {
      javascript: `function singleNumber(nums) {
  // Write your code here
  return 0;
}`,
      python: `def singleNumber(nums):
    # Write your code here
    return 0`,
      java: `class Solution {
    public int singleNumber(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};`,
    },
    hints: [
      'Use XOR properties to cancel out duplicate numbers.',
    ],
    explanation: 'XOR all numbers together; duplicates cancel, leaving the unique number.',
    rating: 4.3,
    ratingCount: 6890,
  },
];
