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
];
