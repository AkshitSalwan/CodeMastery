import { Topic, Problem, Badge, User, Resource } from '../models/index.js';
import { sequelize } from '../config/database.js';

// Seed topics
const topicsData = [
  {
    name: 'Arrays',
    slug: 'arrays',
    description: 'Learn about arrays, the most fundamental data structure. Arrays store elements in contiguous memory locations, allowing efficient random access.',
    difficulty: 'beginner',
    estimated_time: 10,
    tags: ['data-structures', 'fundamentals', 'arrays'],
    icon: 'view_list',
    color: '#4CAF50',
    roadmap: [
      { title: 'Introduction to Arrays', duration: '2 hours' },
      { title: 'Array Operations', duration: '3 hours' },
      { title: 'Two Pointers Technique', duration: '2 hours' },
      { title: 'Sliding Window', duration: '3 hours' }
    ]
  },
  {
    name: 'Linked Lists',
    slug: 'linked-lists',
    description: 'Understand linked lists, a linear data structure where elements are stored in nodes connected by pointers.',
    difficulty: 'beginner',
    estimated_time: 8,
    tags: ['data-structures', 'fundamentals', 'linked-lists'],
    icon: 'link',
    color: '#2196F3',
    roadmap: [
      { title: 'Singly Linked Lists', duration: '2 hours' },
      { title: 'Doubly Linked Lists', duration: '2 hours' },
      { title: 'Circular Linked Lists', duration: '2 hours' },
      { title: 'Common Operations', duration: '2 hours' }
    ]
  },
  {
    name: 'Trees',
    slug: 'trees',
    description: 'Master tree data structures including binary trees, BST, AVL trees, and tree traversal algorithms.',
    difficulty: 'intermediate',
    estimated_time: 15,
    tags: ['data-structures', 'trees', 'algorithms'],
    icon: 'account_tree',
    color: '#FF9800',
    roadmap: [
      { title: 'Binary Trees', duration: '3 hours' },
      { title: 'Binary Search Trees', duration: '4 hours' },
      { title: 'Tree Traversals', duration: '3 hours' },
      { title: 'AVL Trees', duration: '5 hours' }
    ]
  },
  {
    name: 'Graphs',
    slug: 'graphs',
    description: 'Learn graph data structures and algorithms including BFS, DFS, shortest paths, and minimum spanning trees.',
    difficulty: 'intermediate',
    estimated_time: 20,
    tags: ['data-structures', 'graphs', 'algorithms'],
    icon: 'hub',
    color: '#9C27B0',
    roadmap: [
      { title: 'Graph Representation', duration: '3 hours' },
      { title: 'BFS and DFS', duration: '4 hours' },
      { title: 'Shortest Paths', duration: '5 hours' },
      { title: 'Minimum Spanning Trees', duration: '4 hours' },
      { title: 'Topological Sort', duration: '4 hours' }
    ]
  },
  {
    name: 'Dynamic Programming',
    slug: 'dynamic-programming',
    description: 'Master dynamic programming techniques for solving complex problems by breaking them into simpler subproblems.',
    difficulty: 'advanced',
    estimated_time: 25,
    tags: ['algorithms', 'dynamic-programming', 'optimization'],
    icon: 'speed',
    color: '#F44336',
    roadmap: [
      { title: 'Introduction to DP', duration: '3 hours' },
      { title: '1D DP Problems', duration: '5 hours' },
      { title: '2D DP Problems', duration: '6 hours' },
      { title: 'DP on Trees', duration: '5 hours' },
      { title: 'Advanced DP', duration: '6 hours' }
    ]
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'Learn JavaScript from basics to advanced concepts including ES6+, async programming, and DOM manipulation.',
    difficulty: 'beginner',
    estimated_time: 30,
    tags: ['programming', 'javascript', 'web-development'],
    icon: 'code',
    color: '#F7DF1E',
    roadmap: [
      { title: 'JavaScript Basics', duration: '5 hours' },
      { title: 'Functions and Scope', duration: '4 hours' },
      { title: 'Objects and Arrays', duration: '4 hours' },
      { title: 'ES6+ Features', duration: '5 hours' },
      { title: 'Async JavaScript', duration: '6 hours' },
      { title: 'DOM Manipulation', duration: '6 hours' }
    ]
  },
  {
    name: 'React',
    slug: 'react',
    description: 'Build modern user interfaces with React. Learn components, hooks, state management, and best practices.',
    difficulty: 'intermediate',
    estimated_time: 25,
    tags: ['frameworks', 'react', 'web-development', 'frontend'],
    icon: 'web',
    color: '#61DAFB',
    prerequisites: ['javascript'],
    roadmap: [
      { title: 'React Fundamentals', duration: '4 hours' },
      { title: 'Components and Props', duration: '3 hours' },
      { title: 'State and Lifecycle', duration: '4 hours' },
      { title: 'Hooks', duration: '6 hours' },
      { title: 'Context and Redux', duration: '4 hours' },
      { title: 'Performance Optimization', duration: '4 hours' }
    ]
  },
  {
    name: 'System Design',
    slug: 'system-design',
    description: 'Learn to design scalable systems. Cover load balancing, caching, database sharding, and microservices.',
    difficulty: 'advanced',
    estimated_time: 40,
    tags: ['system-design', 'architecture', 'scalability'],
    icon: 'architecture',
    color: '#607D8B',
    roadmap: [
      { title: 'Fundamentals', duration: '5 hours' },
      { title: 'Load Balancing', duration: '4 hours' },
      { title: 'Caching Strategies', duration: '4 hours' },
      { title: 'Database Design', duration: '6 hours' },
      { title: 'Microservices', duration: '6 hours' },
      { title: 'Case Studies', duration: '15 hours' }
    ]
  }
];

// Seed problems
const problemsData = [
  // Arrays problems
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'easy',
    topic_id: 1,
    tags: ['arrays', 'hash-table'],
    constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
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
    test_cases: [
      { input: '2 7 11 15\n9', output: '0 1' },
      { input: '3 2 4\n6', output: '1 2' }
    ],
    hidden_test_cases: [
      { input: '3 3\n6', output: '0 1' },
      { input: '1 2 3 4 5\n9', output: '3 4' }
    ],
    starter_code: {
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = Number(lines[1]);

function twoSum(nums, target) {
    // Your code here
}

const result = twoSum(nums, target);
console.log(result.join(' '));`,
      python: `import sys
input_data = sys.stdin.read().strip().split('\\n')
nums = list(map(int, input_data[0].split()))
target = int(input_data[1])

def twoSum(nums, target):
    # Your code here
    pass

result = twoSum(nums, target)
print(' '.join(map(str, result)))`,
      java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = Integer.parseInt(sc.nextLine().trim());
        int[] result = twoSum(nums, target);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(result[i]);
        }
        System.out.println(sb.toString());
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums;
    int x;
    while (iss >> x) nums.push_back(x);
    int target;
    cin >> target;
    vector<int> result = twoSum(nums, target);
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << " ";
        cout << result[i];
    }
    cout << endl;
    return 0;
}`
    },
    points: 100,
    hints: [
      'Try using a hash map to store the numbers you have seen',
      'For each number, check if (target - number) exists in the map'
    ]
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    difficulty: 'medium',
    topic_id: 1,
    tags: ['arrays', 'dynamic-programming', 'divide-and-conquer'],
    constraints: `1 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      }
    ],
    test_cases: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6' },
      { input: '1', output: '1' },
      { input: '5 4 -1 7 8', output: '23' }
    ],
    hidden_test_cases: [
      { input: '-3 -1 -2', output: '-1' },
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6' },
      { input: '0 0 0', output: '0' }
    ],
    starter_code: {
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);

function maxSubArray(nums) {
    // Your code here
}

console.log(maxSubArray(nums));`,
      python: `import sys
input_data = sys.stdin.read().strip()
nums = list(map(int, input_data.split()))

def maxSubArray(nums):
    # Your code here
    pass

print(maxSubArray(nums))`,
      java: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        System.out.println(maxSubArray(nums));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Your code here
    return 0;
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums;
    int x;
    while (iss >> x) nums.push_back(x);
    cout << maxSubArray(nums) << endl;
    return 0;
}`
    },
    points: 200,
    hints: [
      'Kadane\'s algorithm is the optimal solution',
      'Keep track of the maximum sum ending at each position'
    ]
  },
  {
    title: 'Merge Sorted Arrays',
    slug: 'merge-sorted-arrays',
    description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.`,
    difficulty: 'easy',
    topic_id: 1,
    tags: ['arrays', 'two-pointers', 'sorting'],
    constraints: `nums1.length == m + n
nums2.length == n
0 <= m, n <= 200
1 <= m + n <= 200
-10^9 <= nums1[i], nums2[j] <= 10^9`,
    examples: [
      {
        input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
        output: '[1,2,2,3,5,6]'
      }
    ],
    test_cases: [
      { input: '1 2 3 0 0 0\n3\n2 5 6\n3', output: '1 2 2 3 5 6' },
      { input: '1\n1\n\n0', output: '1' },
      { input: '0\n0\n1\n1', output: '1' }
    ],
    hidden_test_cases: [
      { input: '4 5 6 0 0 0\n3\n1 2\n2', output: '1 2 4 5 6' },
      { input: '1 2 3\n3\n2 5 6\n3', output: '1 2 2 3 5 6' },
      { input: '1\n0\n2\n1', output: '1 2' }
    ],
    starter_code: {
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums1 = lines[0].split(' ').map(Number);
const m = Number(lines[1]);
const nums2 = lines[2] ? lines[2].split(' ').map(Number) : [];
const n = Number(lines[3]);

function merge(nums1, m, nums2, n) {
    // Your code here - modify nums1 in-place
}

merge(nums1, m, nums2, n);
console.log(nums1.slice(0, m + n).join(' '));`,
      python: `import sys
input_data = sys.stdin.read().strip().split('\\n')
nums1 = list(map(int, input_data[0].split()))
m = int(input_data[1])
nums2 = list(map(int, input_data[2].split())) if input_data[2].strip() else []
n = int(input_data[3])

def merge(nums1, m, nums2, n):
    # Your code here - modify nums1 in-place
    pass

merge(nums1, m, nums2, n)
print(' '.join(map(str, nums1[:m + n])))`,
      java: `import java.util.*;

public class Main {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        // Your code here - modify nums1 in-place
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] p1 = sc.nextLine().trim().split(" ");
        int[] nums1 = new int[p1.length];
        for (int i = 0; i < p1.length; i++) nums1[i] = Integer.parseInt(p1[i]);
        int m = Integer.parseInt(sc.nextLine().trim());
        String line2 = sc.nextLine().trim();
        int[] nums2 = line2.isEmpty() ? new int[]{} : Arrays.stream(line2.split(" ")).mapToInt(Integer::parseInt).toArray();
        int n = Integer.parseInt(sc.nextLine().trim());
        merge(nums1, m, nums2, n);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m + n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(nums1[i]);
        }
        System.out.println(sb.toString());
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    // Your code here - modify nums1 in-place
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss1(line);
    vector<int> nums1;
    int x;
    while (iss1 >> x) nums1.push_back(x);
    int m;
    cin >> m; cin.ignore();
    getline(cin, line);
    istringstream iss2(line);
    vector<int> nums2;
    while (iss2 >> x) nums2.push_back(x);
    int n;
    cin >> n;
    merge(nums1, m, nums2, n);
    for (int i = 0; i < m + n; i++) {
        if (i > 0) cout << " ";
        cout << nums1[i];
    }
    cout << endl;
    return 0;
}`
    },
    points: 100
  },
  // Linked Lists problems
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    difficulty: 'easy',
    topic_id: 2,
    tags: ['linked-list', 'recursion'],
    constraints: `The number of nodes in the list is the range [0, 5000].
-5000 <= Node.val <= 5000`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      }
    ],
    test_cases: [
      { input: '1 2 3 4 5', output: '5 4 3 2 1' },
      { input: '1 2', output: '2 1' },
      { input: '', output: '' }
    ],
    hidden_test_cases: [
      { input: '1', output: '1' },
      { input: '1 2 3 4 5', output: '5 4 3 2 1' },
      { input: '7 8 9', output: '9 8 7' }
    ],
    starter_code: {
      javascript: `const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
const values = input ? input.split(' ').map(Number) : [];

function reverseList(values) {
    // Your code here - reverse the array
    return values.reverse();
}

const result = reverseList(values);
console.log(result.join(' '));`,
      python: `import sys
input_data = sys.stdin.read().strip()
values = list(map(int, input_data.split())) if input_data else []

def reverseList(values):
    # Your code here - reverse the list
    return values[::-1]

result = reverseList(values)
print(' '.join(map(str, result)))`,
      java: `import java.util.*;

public class Main {
    public static int[] reverseList(int[] values) {
        // Your code here - reverse the array
        int[] result = new int[values.length];
        for (int i = 0; i < values.length; i++) {
            result[i] = values[values.length - 1 - i];
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        if (line.isEmpty()) {
            System.out.println();
            return;
        }
        String[] parts = line.split(" ");
        int[] values = new int[parts.length];
        for (int i = 0; i < parts.length; i++) values[i] = Integer.parseInt(parts[i]);
        int[] result = reverseList(values);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(result[i]);
        }
        System.out.println(sb.toString());
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> reverseList(vector<int>& values) {
    // Your code here - reverse the vector
    vector<int> result(values.rbegin(), values.rend());
    return result;
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> values;
    int x;
    while (iss >> x) values.push_back(x);
    if (values.empty()) {
        cout << endl;
        return 0;
    }
    vector<int> result = reverseList(values);
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << " ";
        cout << result[i];
    }
    cout << endl;
    return 0;
}`
    },
    points: 100
  },
  {
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.`,
    difficulty: 'easy',
    topic_id: 2,
    tags: ['linked-list', 'two-pointers', 'hash-table'],
    constraints: `The number of the nodes in the list is in the range [0, 10^4].
-10^5 <= Node.val <= 10^5`,
    examples: [
      {
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).'
      }
    ],
    test_cases: [
      { input: '3 2 0 -4\n1', output: 'true' },
      { input: '1\n-1', output: 'false' },
      { input: '1 2\n0', output: 'true' }
    ],
    hidden_test_cases: [
      { input: '3 2 0 -4\n1', output: 'true' },
      { input: '1\n-1', output: 'false' },
      { input: '1 2\n0', output: 'true' },
      { input: '2 1\n1', output: 'true' },
      { input: '1 2 3 4 5\n-1', output: 'false' }
    ],
    starter_code: {
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const values = lines[0].split(' ').map(Number);
const pos = Number(lines[1]);

function hasCycle(values, pos) {
    // Your code here
    // values: array of node values, pos: index where tail connects (-1 = no cycle)
    return pos >= 0;
}

console.log(hasCycle(values, pos) ? 'true' : 'false');`,
      python: `import sys
input_data = sys.stdin.read().strip().split('\\n')
values = list(map(int, input_data[0].split()))
pos = int(input_data[1])

def hasCycle(values, pos):
    # Your code here
    # values: list of node values, pos: index where tail connects (-1 = no cycle)
    return pos >= 0

print('true' if hasCycle(values, pos) else 'false')`,
      java: `import java.util.*;

public class Main {
    public static boolean hasCycle(int[] values, int pos) {
        // Your code here
        // values: array of node values, pos: index where tail connects (-1 = no cycle)
        return pos >= 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] values = new int[parts.length];
        for (int i = 0; i < parts.length; i++) values[i] = Integer.parseInt(parts[i]);
        int pos = Integer.parseInt(sc.nextLine().trim());
        System.out.println(hasCycle(values, pos) ? "true" : "false");
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool hasCycle(vector<int>& values, int pos) {
    // Your code here
    // values: vector of node values, pos: index where tail connects (-1 = no cycle)
    return pos >= 0;
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> values;
    int x;
    while (iss >> x) values.push_back(x);
    int pos;
    cin >> pos;
    cout << (hasCycle(values, pos) ? "true" : "false") << endl;
    return 0;
}`
    },
    points: 100,
    hints: [
      'Use Floyd\'s cycle detection algorithm (tortoise and hare)',
      'Use two pointers moving at different speeds'
    ]
  },
  // Trees problems
  {
    title: 'Binary Tree Inorder Traversal',
    slug: 'binary-tree-inorder-traversal',
    description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.`,
    difficulty: 'easy',
    topic_id: 3,
    tags: ['tree', 'depth-first-search', 'stack'],
    constraints: `The number of nodes in the tree is in the range [0, 100].
-100 <= Node.val <= 100`,
    examples: [
      {
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]'
      }
    ],
    test_cases: [
      { input: '1 null 2 3', output: '1 3 2' },
      { input: '', output: '' },
      { input: '1', output: '1' }
    ],
    hidden_test_cases: [
      { input: '1 2 3', output: '1 2 3' },
      { input: '1 null 2 null 3', output: '1 2 3' },
      { input: '1 null 2 3 null null 4', output: '1 2 3 4' }
    ],
    starter_code: {
      javascript: `const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
const tokens = input.split(' ');

// Build binary tree from level-order input
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val; this.left = left; this.right = right;
    }
}

function buildTree(tokens) {
    if (!tokens.length || tokens[0] === 'null' || tokens[0] === '') return null;
    const root = new TreeNode(Number(tokens[0]));
    const queue = [root];
    let i = 1;
    while (i < tokens.length) {
        const node = queue.shift();
        if (i < tokens.length && tokens[i] !== 'null') {
            node.left = new TreeNode(Number(tokens[i]));
            queue.push(node.left);
        }
        i++;
        if (i < tokens.length && tokens[i] !== 'null') {
            node.right = new TreeNode(Number(tokens[i]));
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function inorderTraversal(root) {
    // Your code here - return array of values
    const result = [];
    return result;
}

const root = buildTree(tokens);
const result = inorderTraversal(root);
console.log(result.join(' '));`,
      python: `import sys
from collections import deque

input_data = sys.stdin.read().strip()
tokens = input_data.split() if input_data else []

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(tokens):
    if not tokens or tokens[0] == 'null':
        return None
    root = TreeNode(int(tokens[0]))
    queue = deque([root])
    i = 1
    while i < len(tokens):
        node = queue.popleft()
        if i < len(tokens) and tokens[i] != 'null':
            node.left = TreeNode(int(tokens[i]))
            queue.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != 'null':
            node.right = TreeNode(int(tokens[i]))
            queue.append(node.right)
        i += 1
    return root

def inorderTraversal(root):
    # Your code here - return list of values
    result = []
    return result

root = buildTree(tokens)
result = inorderTraversal(root)
print(' '.join(map(str, result)))`,
      java: `import java.util.*;

public class Main {
    static int[] buildTree;

    public static List<Integer> inorderTraversal(int index) {
        // Your code here
        // buildTree array holds level-order values, -101 means null
        // index is 0-based position in the array
        List<Integer> result = new ArrayList<>();
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        if (line.isEmpty()) {
            System.out.println();
            return;
        }
        String[] tokens = line.split(" ");
        buildTree = new int[tokens.length];
        for (int i = 0; i < tokens.length; i++) {
            buildTree[i] = tokens[i].equals("null") ? -101 : Integer.parseInt(tokens[i]);
        }
        // Simple inorder on level-order array using recursive approach
        List<Integer> result = new ArrayList<>();
        inorderHelper(0, result);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(result.get(i));
        }
        System.out.println(sb.toString());
    }

    static void inorderHelper(int index, List<Integer> result) {
        if (index >= buildTree.length || buildTree[index] == -101) return;
        inorderHelper(2 * index + 1, result);
        result.add(buildTree[index]);
        inorderHelper(2 * index + 2, result);
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<string>& tokens) {
    if (tokens.empty() || tokens[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < tokens.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < tokens.size() && tokens[i] != "null") {
            node->left = new TreeNode(stoi(tokens[i]));
            q.push(node->left);
        }
        i++;
        if (i < tokens.size() && tokens[i] != "null") {
            node->right = new TreeNode(stoi(tokens[i]));
            q.push(node->right);
        }
        i++;
    }
    return root;
}

vector<int> inorderTraversal(TreeNode* root) {
    // Your code here - return vector of values
    vector<int> result;
    return result;
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<string> tokens;
    string token;
    while (iss >> token) tokens.push_back(token);
    TreeNode* root = buildTree(tokens);
    vector<int> result = inorderTraversal(root);
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << " ";
        cout << result[i];
    }
    cout << endl;
    return 0;
}`
    },
    points: 100
  },
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-binary-tree',
    description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    difficulty: 'easy',
    topic_id: 3,
    tags: ['tree', 'depth-first-search', 'breadth-first-search', 'recursion'],
    constraints: `The number of nodes in the tree is in the range [0, 10^4].
-100 <= Node.val <= 100`,
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3'
      }
    ],
    test_cases: [
      { input: '3 9 20 null null 15 7', output: '3' },
      { input: '1', output: '1' },
      { input: '', output: '0' }
    ],
    hidden_test_cases: [
      { input: '1 null 2', output: '2' },
      { input: '', output: '0' }
    ],
    starter_code: {
      javascript: `const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
const tokens = input.split(' ');

class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val; this.left = left; this.right = right;
    }
}

function buildTree(tokens) {
    if (!tokens.length || tokens[0] === 'null' || tokens[0] === '') return null;
    const root = new TreeNode(Number(tokens[0]));
    const queue = [root];
    let i = 1;
    while (i < tokens.length) {
        const node = queue.shift();
        if (i < tokens.length && tokens[i] !== 'null') {
            node.left = new TreeNode(Number(tokens[i]));
            queue.push(node.left);
        }
        i++;
        if (i < tokens.length && tokens[i] !== 'null') {
            node.right = new TreeNode(Number(tokens[i]));
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function maxDepth(root) {
    // Your code here
    return 0;
}

const root = buildTree(tokens);
console.log(maxDepth(root));`,
      python: `import sys
from collections import deque

input_data = sys.stdin.read().strip()
tokens = input_data.split() if input_data else []

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(tokens):
    if not tokens or tokens[0] == 'null':
        return None
    root = TreeNode(int(tokens[0]))
    queue = deque([root])
    i = 1
    while i < len(tokens):
        node = queue.popleft()
        if i < len(tokens) and tokens[i] != 'null':
            node.left = TreeNode(int(tokens[i]))
            queue.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != 'null':
            node.right = TreeNode(int(tokens[i]))
            queue.append(node.right)
        i += 1
    return root

def maxDepth(root):
    # Your code here
    return 0

root = buildTree(tokens)
print(maxDepth(root))`,
      java: `import java.util.*;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    static TreeNode buildTree(String[] tokens) {
        if (tokens.length == 0 || tokens[0].equals("null") || tokens[0].isEmpty()) return null;
        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < tokens.length) {
            TreeNode node = queue.poll();
            if (i < tokens.length && !tokens[i].equals("null")) {
                node.left = new TreeNode(Integer.parseInt(tokens[i]));
                queue.add(node.left);
            }
            i++;
            if (i < tokens.length && !tokens[i].equals("null")) {
                node.right = new TreeNode(Integer.parseInt(tokens[i]));
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    public static int maxDepth(TreeNode root) {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        if (line.isEmpty()) { System.out.println(0); return; }
        String[] tokens = line.split(" ");
        TreeNode root = buildTree(tokens);
        System.out.println(maxDepth(root));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<string>& tokens) {
    if (tokens.empty() || tokens[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < tokens.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < tokens.size() && tokens[i] != "null") {
            node->left = new TreeNode(stoi(tokens[i]));
            q.push(node->left);
        }
        i++;
        if (i < tokens.size() && tokens[i] != "null") {
            node->right = new TreeNode(stoi(tokens[i]));
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int maxDepth(TreeNode* root) {
    // Your code here
    return 0;
}

int main() {
    string line;
    getline(cin, line);
    if (line.empty()) { cout << 0 << endl; return 0; }
    istringstream iss(line);
    vector<string> tokens;
    string token;
    while (iss >> token) tokens.push_back(token);
    TreeNode* root = buildTree(tokens);
    cout << maxDepth(root) << endl;
    return 0;
}`
    },
    points: 100
  },
  // Graphs problems
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    difficulty: 'medium',
    topic_id: 4,
    tags: ['graph', 'depth-first-search', 'breadth-first-search', 'matrix'],
    constraints: `m == grid.length
n == grid[i].length
1 <= m, n <= 300
grid[i][j] is '0' or '1'.`,
    examples: [
      {
        input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
        output: '1'
      }
    ],
    test_cases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1' }
    ],
    hidden_test_cases: [
      { input: '1 1\n1', output: '1' },
      { input: '3 3\n1 0 1\n0 1 0\n1 0 1', output: '5' }
    ],
    starter_code: {
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [rows, cols] = lines[0].split(' ').map(Number);
const grid = [];
for (let i = 1; i <= rows; i++) {
    grid.push(lines[i].split(' '));
}

function numIslands(grid) {
    // Your code here
    return 0;
}

console.log(numIslands(grid));`,
      python: `import sys
input_data = sys.stdin.read().strip().split('\\n')
rows, cols = map(int, input_data[0].split())
grid = []
for i in range(1, rows + 1):
    grid.append(input_data[i].split())

def numIslands(grid):
    # Your code here
    return 0

print(numIslands(grid))`,
      java: `import java.util.*;

public class Main {
    public static int numIslands(char[][] grid) {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] dim = sc.nextLine().trim().split(" ");
        int rows = Integer.parseInt(dim[0]);
        int cols = Integer.parseInt(dim[1]);
        char[][] grid = new char[rows][cols];
        for (int i = 0; i < rows; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            for (int j = 0; j < cols; j++) {
                grid[i][j] = parts[j].charAt(0);
            }
        }
        System.out.println(numIslands(grid));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // Your code here
    return 0;
}

int main() {
    int rows, cols;
    cin >> rows >> cols; cin.ignore();
    vector<vector<char>> grid(rows, vector<char>(cols));
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            cin >> grid[i][j];
        }
    }
    cout << numIslands(grid) << endl;
    return 0;
}`
    },
    points: 200,
    hints: [
      'Use DFS or BFS to explore each island',
      'Mark visited cells to avoid counting them again'
    ]
  },
  // Dynamic Programming problems
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    difficulty: 'easy',
    topic_id: 5,
    tags: ['dynamic-programming', 'math', 'memoization'],
    constraints: `1 <= n <= 45`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps'
      }
    ],
    test_cases: [
      { input: '2', output: '2' },
      { input: '3', output: '3' }
    ],
    hidden_test_cases: [
      { input: '1', output: '1' },
      { input: '5', output: '8' },
      { input: '10', output: '89' }
    ],
    starter_code: {
      javascript: `const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
const n = Number(input);

function climbStairs(n) {
    // Your code here
    return 0;
}

console.log(climbStairs(n));`,
      python: `import sys
n = int(sys.stdin.read().strip())

def climbStairs(n):
    # Your code here
    return 0

print(climbStairs(n))`,
      java: `import java.util.*;

public class Main {
    public static int climbStairs(int n) {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        System.out.println(climbStairs(n));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    // Your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}`
    },
    points: 100,
    hints: [
      'This is essentially the Fibonacci sequence',
      'Use dynamic programming to avoid recalculating subproblems'
    ]
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.`,
    difficulty: 'medium',
    topic_id: 5,
    tags: ['dynamic-programming', 'breadth-first-search'],
    constraints: `1 <= coins.length <= 12
1 <= coins[i] <= 2^31 - 1
0 <= amount <= 10^4`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      }
    ],
    test_cases: [
      { input: '1 2 5\n11', output: '3' },
      { input: '2\n3', output: '-1' },
      { input: '1\n0', output: '0' }
    ],
    hidden_test_cases: [
      { input: '10\n10', output: '1' },
      { input: '1 3 4\n6', output: '2' },
      { input: '3 4\n5', output: '-1' }
    ],
    starter_code: {
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const coins = lines[0].split(' ').map(Number);
const amount = Number(lines[1]);

function coinChange(coins, amount) {
    // Your code here
    return -1;
}

console.log(coinChange(coins, amount));`,
      python: `import sys
input_data = sys.stdin.read().strip().split('\\n')
coins = list(map(int, input_data[0].split()))
amount = int(input_data[1])

def coinChange(coins, amount):
    # Your code here
    return -1

print(coinChange(coins, amount))`,
      java: `import java.util.*;

public class Main {
    public static int coinChange(int[] coins, int amount) {
        // Your code here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] coins = new int[parts.length];
        for (int i = 0; i < parts.length; i++) coins[i] = Integer.parseInt(parts[i]);
        int amount = Integer.parseInt(sc.nextLine().trim());
        System.out.println(coinChange(coins, amount));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Your code here
    return -1;
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> coins;
    int x;
    while (iss >> x) coins.push_back(x);
    int amount;
    cin >> amount;
    cout << coinChange(coins, amount) << endl;
    return 0;
}`
    },
    points: 200,
    hints: [
      'Use dynamic programming with a 1D array',
      'dp[i] represents the minimum coins needed for amount i'
    ]
  },
  {
    title: 'Search Jolly',
    slug: 'search-jolly',
    description: 'Find if jolly or bunts exists in the array. Return true for jolly, biceps for bunts, false otherwise.',
    difficulty: 'easy',
    topic_id: 1,
    tags: ['arrays', 'string', 'search'],
    constraints: `1 <= arr.length <= 100
Each string contains only lowercase letters`,
    examples: [
      {
        input: 'jolly happy',
        output: 'true',
        explanation: 'Found "jolly" in the array'
      },
      {
        input: 'bunts wild',
        output: 'biceps',
        explanation: 'Found "bunts" in the array'
      },
      {
        input: 'happy sad',
        output: 'false',
        explanation: 'Neither "jolly" nor "bunts" found'
      }
    ],
    test_cases: [
      { input: 'jolly', output: 'true' },
      { input: 'hello jolly world', output: 'true' },
      { input: 'bunts', output: 'biceps' },
      { input: 'nothing here', output: 'false' }
    ],
    hidden_test_cases: [
      { input: 'jolly jolly jolly', output: 'true' },
      { input: 'bunts bunts', output: 'biceps' },
      { input: 'joll bunt', output: 'false' },
      { input: 'happy sad jolly', output: 'true' },
      { input: 'test bunts case', output: 'biceps' }
    ],
    starter_code: {
      javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function checkWords(arr) {
    // Write your code here
    return false;
}

let input = '';
rl.on('line', (line) => {
    input = line.trim();
    const arr = input.split(' ');
    const result = checkWords(arr);
    console.log(result);
    rl.close();
});`,
      python: `def checkWords(arr):
    # Write your code here
    return False

if __name__ == "__main__":
    input_str = input().strip()
    arr = input_str.split()
    result = checkWords(arr)
    print(result)`,
      java: `import java.util.*;

public class Main {
    public static Object checkWords(String[] arr) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine().trim();
        String[] arr = input.split(" ");
        Object result = checkWords(arr);
        System.out.println(result);
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool checkWords(vector<string>& arr) {
    // Write your code here
    return false;
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<string> arr;
    string word;
    while (iss >> word) arr.push_back(word);
    
    // Check for "jolly" first
    for (const string& w : arr) {
        if (w == "jolly") {
            cout << "true" << endl;
            return 0;
        }
    }
    
    // Check for "bunts" second
    for (const string& w : arr) {
        if (w == "bunts") {
            cout << "biceps" << endl;
            return 0;
        }
    }
    
    cout << "false" << endl;
    return 0;
}`
    },
    points: 50,
    hints: [
      'Use a for loop',
      'Compare strings',
      'Return true for jolly',
      'Return "biceps" for bunts',
      'Check priority: jolly first, then bunts'
    ]
  },
  // Maximum Circular Subarray Sum
  {
    title: 'Maximum Circular Subarray Sum',
    slug: 'maximum-circular-subarray-sum',
    description: `Given a circular integer array nums (the last element is adjacent to the first element), find the maximum sum of any subarray of nums.

A subarray is a contiguous part of the array. In a circular array, a subarray may wrap around. For example, [3,4,5,6,7] is a subarray of [7,3,4,5,6,7] and [7] is a subarray of [7,3,4,5,6,7].`,
    difficulty: 'medium',
    topic_id: 1,
    tags: ['arrays', 'dynamic-programming', 'kadane-algorithm'],
    constraints: `1 <= nums.length <= 3 × 10^4
-3 × 10^4 <= nums[i] <= 3 × 10^4`,
    examples: [
      {
        input: '[1,-2,3,-2]',
        output: '3',
        explanation: 'Subarray [3] has the maximum sum 3'
      },
      {
        input: '[5,-3,5]',
        output: '10',
        explanation: 'Subarray [5,5] (wraps around) has the maximum sum 5 + 5 = 10'
      },
      {
        input: '[-2,-3,-1]',
        output: '-1',
        explanation: 'Subarray [-1] has the maximum sum -1'
      }
    ],
    test_cases: [
      { input: '[1,-2,3,-2]', output: '3' },
      { input: '[5,-3,5]', output: '10' },
      { input: '[-2,-3,-1]', output: '-1' },
      { input: '[3,-1,2,-1]', output: '4' },
      { input: '[8,-8,5]', output: '13' }
    ],
    hidden_test_cases: [
      { input: '[1]', output: '1' },
      { input: '[-5]', output: '-5' },
      { input: '[1,-2,3,4,-5,8]', output: '12' },
      { input: '[-1,-2,-3,-4]', output: '-1' },
      { input: '[10,10,-10,10,10]', output: '40' }
    ],
    starter_code: {
      javascript: `function maxSubarraySumCircular(nums) {
    // Helper function to find maximum subarray
    function maxSubarray(arr) {
        let maxSum = arr[0], sum = arr[0];
        for (let i = 1; i < arr.length; i++) {
            sum = Math.max(arr[i], sum + arr[i]);
            maxSum = Math.max(maxSum, sum);
        }
        return maxSum;
    }
    
    // Helper function to find minimum subarray
    function minSubarray(arr) {
        let minSum = arr[0], sum = arr[0];
        for (let i = 1; i < arr.length; i++) {
            sum = Math.min(arr[i], sum + arr[i]);
            minSum = Math.min(minSum, sum);
        }
        return minSum;
    }
    
    // Write your code here
    return 0;
}`,
      python: `def maxSubarraySumCircular(nums):
    def maxSubarray(arr):
        maxSum, sum_ = arr[0], arr[0]
        for i in range(1, len(arr)):
            sum_ = max(arr[i], sum_ + arr[i])
            maxSum = max(maxSum, sum_)
        return maxSum
    
    def minSubarray(arr):
        minSum, sum_ = arr[0], arr[0]
        for i in range(1, len(arr)):
            sum_ = min(arr[i], sum_ + arr[i])
            minSum = min(minSum, sum_)
        return minSum
    
    # Write your code here
    return 0`,
      java: `public class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        // Write your code here
        return 0;
    }
    
    private int maxSubarray(int[] nums) {
        int maxSum = nums[0], sum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            sum = Math.max(nums[i], sum + nums[i]);
            maxSum = Math.max(maxSum, sum);
        }
        return maxSum;
    }
    
    private int minSubarray(int[] nums) {
        int minSum = nums[0], sum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            sum = Math.min(nums[i], sum + nums[i]);
            minSum = Math.min(minSum, sum);
        }
        return minSum;
    }
}`,
      cpp: `class Solution {
public:
    int maxSubarraySumCircular(vector<int>& nums) {
        // Write your code here
        return 0;
    }
    
private:
    int maxSubarray(vector<int>& nums) {
        int maxSum = nums[0], sum = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            sum = max(nums[i], sum + nums[i]);
            maxSum = max(maxSum, sum);
        }
        return maxSum;
    }
    
    int minSubarray(vector<int>& nums) {
        int minSum = nums[0], sum = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            sum = min(nums[i], sum + nums[i]);
            minSum = min(minSum, sum);
        }
        return minSum;
    }
};`
    },
    points: 100,
    hints: [
      'There are two cases: maximum sum is either linear (normal Kadane) or circular',
      'For circular case: total_sum - minimum_subarray_sum',
      'Use Kadane algorithm to find both maximum and minimum subarrays',
      'Handle edge case: if all numbers are negative, return the maximum element',
      'The answer is max(maxKadane, totalSum - minKadane)'
    ]
  }
];

// Seed badges
const badgesData = [
  {
    name: 'First Solve',
    slug: 'first-solve',
    description: 'Solved your first problem!',
    icon: 'emoji_events',
    color: '#FFD700',
    category: 'problem_solving',
    criteria: { type: 'submissions', count: 1 },
    points: 10,
    rarity: 'common'
  },
  {
    name: 'Beginner Solver',
    slug: 'beginner-solver',
    description: 'Solved 10 problems',
    icon: 'star',
    color: '#C0C0C0',
    category: 'problem_solving',
    criteria: { type: 'submissions', count: 10 },
    points: 50,
    rarity: 'common'
  },
  {
    name: 'Problem Solver',
    slug: 'problem-solver-50',
    description: 'Solved 50 problems',
    icon: 'military_tech',
    color: '#CD7F32',
    category: 'problem_solving',
    criteria: { type: 'submissions', count: 50 },
    points: 200,
    rarity: 'uncommon'
  },
  {
    name: 'Problem Master',
    slug: 'problem-solver-100',
    description: 'Solved 100 problems',
    icon: 'workspace_premium',
    color: '#FFD700',
    category: 'problem_solving',
    criteria: { type: 'submissions', count: 100 },
    points: 500,
    rarity: 'rare'
  },
  {
    name: 'First Topic',
    slug: 'first-topic',
    description: 'Completed your first topic',
    icon: 'school',
    color: '#4CAF50',
    category: 'learning',
    criteria: { type: 'topics', count: 1 },
    points: 25,
    rarity: 'common'
  },
  {
    name: 'Topic Master',
    slug: 'topic-master-5',
    description: 'Completed 5 topics',
    icon: 'auto_stories',
    color: '#2196F3',
    category: 'learning',
    criteria: { type: 'topics', count: 5 },
    points: 150,
    rarity: 'uncommon'
  },
  {
    name: '7 Day Streak',
    slug: '7-day-streak',
    description: 'Maintained a 7-day DPP streak',
    icon: 'local_fire_department',
    color: '#FF5722',
    category: 'streak',
    criteria: { type: 'streak', count: 7 },
    points: 100,
    rarity: 'uncommon'
  },
  {
    name: '30 Day Streak',
    slug: '30-day-streak',
    description: 'Maintained a 30-day DPP streak',
    icon: 'whatshot',
    color: '#F44336',
    category: 'streak',
    criteria: { type: 'streak', count: 30 },
    points: 500,
    rarity: 'epic'
  },
  {
    name: 'Contest Winner',
    slug: 'contest-winner',
    description: 'Won first place in a contest',
    icon: 'emoji_events',
    color: '#9C27B0',
    category: 'contest',
    criteria: { type: 'contest_win', count: 1 },
    points: 300,
    rarity: 'rare'
  },
  {
    name: 'Helpful Contributor',
    slug: 'helpful-contributor',
    description: 'Received 50 upvotes on discussions',
    icon: 'thumb_up',
    color: '#00BCD4',
    category: 'community',
    criteria: { type: 'upvotes', count: 50 },
    points: 100,
    rarity: 'uncommon'
  }
];

// Seed function
export const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Disable foreign key checks before syncing
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Sync database
    await sequelize.sync({ force: true });
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Database synced');

    // Create topics
    const topics = await Topic.bulkCreate(topicsData);
    console.log(`✅ Created ${topics.length} topics`);

    // Update problems with correct topic IDs
    const problemsWithTopicIds = problemsData.map((problem, index) => {
      const topicIndex = problem.topic_id - 1;
      return {
        ...problem,
        topic_id: topics[topicIndex]?.id || null
      };
    });

    // Create problems
    const problems = await Problem.bulkCreate(problemsWithTopicIds);
    console.log(`✅ Created ${problems.length} problems`);

    // Create badges
    const badges = await Badge.bulkCreate(badgesData);
    console.log(`✅ Created ${badges.length} badges`);

    console.log('🎉 Database seeding completed successfully!');
    
    return { topics, problems, badges };
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeders()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default runSeeders;
