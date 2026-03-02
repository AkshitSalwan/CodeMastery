import type { Problem } from '@/lib/types/problem';

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    category: ['Array', 'Hash Table'],
    acceptanceRate: 48.2,
    submissions: 42500000,
    companies: ['Google', 'Amazon', 'Apple'],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    starterCode: {
      javascript: `var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};`,
      python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] { i, j };
                }
            }
        }
        return new int[] {};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};`
    },
    hints: [
      'A really brute force way would be to search for complements for every number in the array.',
      'So, the time complexity of the brute force approach is O(n^2). Can we do better?',
      'A hash table. When we visit a number num, we can check if target - num exists in the hash table.',
      'If it exists, we have found a solution and return immediately. If not, we add num to the hash table and continue.',
      'What should be the size of the hash table? Does it matter?'
    ],
    explanation: `## Approach: Hash Map
Use a hash map to store the complement of each number and check if it exists as we iterate.

### Time Complexity: O(n)
### Space Complexity: O(n)

The optimal solution uses a hash map to achieve O(n) time complexity.`
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    difficulty: 'Medium',
    category: ['Linked List', 'Math'],
    acceptanceRate: 32.5,
    submissions: 2500000,
    companies: ['Amazon', 'Bloomberg'],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.'
    ],
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807'
      }
    ],
    starterCode: {
      javascript: `var addTwoNumbers = function(l1, l2) {
    const dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;
    
    while (l1 || l2 || carry) {
        current.next = new ListNode(0);
        current = current.next;
    }
    
    return dummy.next;
};`,
      python: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        current.next = ListNode(0)
        current = current.next
    
    return dummy.next`,
      java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        int carry = 0;
        
        while (l1 != null || l2 != null || carry != 0) {
            current.next = new ListNode(0);
            current = current.next;
        }
        
        return dummy.next;
    }
}`,
      cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* dummy = new ListNode(0);
        ListNode* current = dummy;
        int carry = 0;
        
        while (l1 || l2 || carry) {
            current->next = new ListNode(0);
            current = current->next;
        }
        
        return dummy->next;
    }
};`
    },
    hints: [
      'Keep track of the carry using a variable and simulate the digits-by-digits sum starting from the head of list, just like how you would add two numbers on a piece of paper.',
      'Traverse both lists at the same time. If one of the lists is longer, continue the iteration by considering the longer list node value as 0.',
      'Beware of the last carry needed to be added to the new list.'
    ],
    explanation: `## Approach: Elementary Math
Simulate the addition digit by digit, carrying over when necessary.

### Time Complexity: O(max(m, n))
### Space Complexity: O(max(m, n))

We iterate through both lists and perform addition with carry.`
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    category: ['String', 'Sliding Window'],
    acceptanceRate: 33.8,
    submissions: 8500000,
    companies: ['Google', 'Amazon', 'Microsoft'],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    starterCode: {
      javascript: `var lengthOfLongestSubstring = function(s) {
    const charMap = {};
    let maxLen = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        if (charMap[s[right]] >= left) {
            left = charMap[s[right]] + 1;
        }
        charMap[s[right]] = right;
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
};`,
      python: `def lengthOfLongestSubstring(s):
    charMap = {}
    maxLen = 0
    left = 0
    
    for right in range(len(s)):
        if s[right] in charMap and charMap[s[right]] >= left:
            left = charMap[s[right]] + 1
        charMap[s[right]] = right
        maxLen = max(maxLen, right - left + 1)
    
    return maxLen`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> charMap = new HashMap<>();
        int maxLen = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            if (charMap.containsKey(s.charAt(right)) && charMap.get(s.charAt(right)) >= left) {
                left = charMap.get(s.charAt(right)) + 1;
            }
            charMap.put(s.charAt(right), right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> charMap;
        int maxLen = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            if (charMap.count(s[right]) && charMap[s[right]] >= left) {
                left = charMap[s[right]] + 1;
            }
            charMap[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
};`
    },
    hints: [
      'Use a sliding window approach.',
      'Keep track of characters and their indices in a hash map.',
      'When a duplicate is found, move the left pointer to the right of the previous occurrence.'
    ],
    explanation: `## Approach: Sliding Window
Use two pointers to maintain a window of characters without repetition.

### Time Complexity: O(n)
### Space Complexity: O(min(m, n))

Where m is the character set size.`
  },
  {
    id: '4',
    title: 'Reverse Integer',
    description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.',
    difficulty: 'Easy',
    category: ['Math'],
    acceptanceRate: 26.2,
    submissions: 5500000,
    companies: ['Amazon', 'Google'],
    constraints: [
      '-2^31 <= x <= 2^31 - 1'
    ],
    examples: [
      {
        input: 'x = 123',
        output: '321',
        explanation: ''
      },
      {
        input: 'x = -123',
        output: '-321',
        explanation: ''
      },
      {
        input: 'x = 120',
        output: '21',
        explanation: ''
      }
    ],
    starterCode: {
      javascript: `var reverse = function(x) {
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = Math.pow(-2, 31);
    
    let result = 0;
    let num = Math.abs(x);
    
    while (num !== 0) {
        const digit = num % 10;
        num = Math.floor(num / 10);
        
        if (result > INT_MAX / 10 || (result === INT_MAX / 10 && digit > 7)) {
            return 0;
        }
        result = result * 10 + digit;
    }
    
    return x < 0 ? -result : result;
};`,
      python: `def reverse(x):
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    
    result = 0
    num = abs(x)
    
    while num != 0:
        digit = num % 10
        num //= 10
        
        if result > INT_MAX // 10 or (result == INT_MAX // 10 and digit > 7):
            return 0
        result = result * 10 + digit
    
    return -result if x < 0 else result`,
      java: `class Solution {
    public int reverse(int x) {
        int result = 0;
        while (x != 0) {
            int digit = x % 10;
            x /= 10;
            
            if (result > Integer.MAX_VALUE / 10 || (result == Integer.MAX_VALUE / 10 && digit > 7)) {
                return 0;
            }
            if (result < Integer.MIN_VALUE / 10 || (result == Integer.MIN_VALUE / 10 && digit < -8)) {
                return 0;
            }
            result = result * 10 + digit;
        }
        return result;
    }
}`,
      cpp: `class Solution {
public:
    int reverse(int x) {
        int result = 0;
        while (x != 0) {
            int digit = x % 10;
            x /= 10;
            
            if (result > INT_MAX / 10 || (result == INT_MAX / 10 && digit > 7)) {
                return 0;
            }
            if (result < INT_MIN / 10 || (result == INT_MIN / 10 && digit < -8)) {
                return 0;
            }
            result = result * 10 + digit;
        }
        return result;
    }
};`
    },
    hints: [
      'Reverse the digits of the number.',
      'Be careful about integer overflow.'
    ],
    explanation: `## Approach: Math
Extract digits and reverse while checking for overflow.

### Time Complexity: O(log x)
### Space Complexity: O(1)`
  },
  {
    id: '5',
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    difficulty: 'Hard',
    category: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: 26.6,
    submissions: 1500000,
    companies: ['Google', 'Amazon', 'Microsoft'],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2001'
    ],
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    starterCode: {
      javascript: `var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
    }
    
    let low = 0, high = nums1.length;
    const m = nums1.length;
    const n = nums2.length;
    
    while (low <= high) {
        const cut1 = Math.floor((low + high) / 2);
        const cut2 = Math.floor((m + n + 1) / 2) - cut1;
        
        const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
        const right1 = cut1 === m ? Infinity : nums1[cut1];
        
        const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
        const right2 = cut2 === n ? Infinity : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 === 0) {
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
            } else {
                return Math.max(left1, left2);
            }
        } else if (left1 > right2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    
    return -1;
};`,
      python: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        return findMedianSortedArrays(nums2, nums1)
    
    low, high = 0, len(nums1)
    m, n = len(nums1), len(nums2)
    
    while low <= high:
        cut1 = (low + high) // 2
        cut2 = (m + n + 1) // 2 - cut1
        
        left1 = float('-inf') if cut1 == 0 else nums1[cut1 - 1]
        right1 = float('inf') if cut1 == m else nums1[cut1]
        
        left2 = float('-inf') if cut2 == 0 else nums2[cut2 - 1]
        right2 = float('inf') if cut2 == n else nums2[cut2]
        
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 0:
                return (max(left1, left2) + min(right1, right2)) / 2
            else:
                return max(left1, left2)
        elif left1 > right2:
            high = cut1 - 1
        else:
            low = cut1 + 1
    
    return -1`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int low = 0, high = nums1.length;
        int m = nums1.length, n = nums2.length;
        
        while (low <= high) {
            int cut1 = (low + high) / 2;
            int cut2 = (m + n + 1) / 2 - cut1;
            
            int left1 = cut1 == 0 ? Integer.MIN_VALUE : nums1[cut1 - 1];
            int right1 = cut1 == m ? Integer.MAX_VALUE : nums1[cut1];
            
            int left2 = cut2 == 0 ? Integer.MIN_VALUE : nums2[cut2 - 1];
            int right2 = cut2 == n ? Integer.MAX_VALUE : nums2[cut2];
            
            if (left1 <= right2 && left2 <= right1) {
                if ((m + n) % 2 == 0) {
                    return (Math.max(left1, left2) + Math.min(right1, right2)) / 2.0;
                } else {
                    return Math.max(left1, left2);
                }
            } else if (left1 > right2) {
                high = cut1 - 1;
            } else {
                low = cut1 + 1;
            }
        }
        
        return -1.0;
    }
}`,
      cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int low = 0, high = nums1.size();
        int m = nums1.size(), n = nums2.size();
        
        while (low <= high) {
            int cut1 = (low + high) / 2;
            int cut2 = (m + n + 1) / 2 - cut1;
            
            int left1 = cut1 == 0 ? INT_MIN : nums1[cut1 - 1];
            int right1 = cut1 == m ? INT_MAX : nums1[cut1];
            
            int left2 = cut2 == 0 ? INT_MIN : nums2[cut2 - 1];
            int right2 = cut2 == n ? INT_MAX : nums2[cut2];
            
            if (left1 <= right2 && left2 <= right1) {
                if ((m + n) % 2 == 0) {
                    return (max(left1, left2) + min(right1, right2)) / 2.0;
                } else {
                    return max(left1, left2);
                }
            } else if (left1 > right2) {
                high = cut1 - 1;
            } else {
                low = cut1 + 1;
            }
        }
        
        return -1.0;
    }
};`
    },
    hints: [
      'This problem can be solved using binary search.',
      'The idea is to find the partition point in the smaller array.',
      'The partition ensures that all elements on the left are <= all elements on the right.'
    ],
    explanation: `## Approach: Binary Search
Use binary search on the smaller array to find the correct partition.

### Time Complexity: O(log(min(m, n)))
### Space Complexity: O(1)`
  }
];
