import sequelize from './server/config/database.js';
import { Problem } from './server/models/index.js';

const problemUpdates = [
  {
    id: 1,
    title: "Two Sum",
    starter_code: {
      javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function twoSum(nums, target) {
    // Write your code here
    return [];
}

let lines = [];
rl.on('line', (line) => {
    lines.push(line.trim());
    if (lines.length === 2) {
        const nums = lines[0].split(' ').map(Number);
        const target = Number(lines[1]);
        const result = twoSum(nums, target);
        console.log(result.join(' '));
        rl.close();
    }
});`,
      python: `def twoSum(nums, target):
    # Write your code here
    return []

if __name__ == "__main__":
    nums = list(map(int, input().split()))
    target = int(input())
    result = twoSum(nums, target)
    print(' '.join(map(str, result)))`,
      java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
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
    // Write your code here
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
    }
  },
  {
    id: 2,
    title: "Maximum Subarray",
    starter_code: {
      javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

function maxSubArray(nums) {
    // Write your code here
    return 0;
}

rl.on('line', (line) => {
    const nums = line.trim().split(' ').map(Number);
    console.log(maxSubArray(nums));
    rl.close();
});`,
      python: `def maxSubArray(nums):
    # Write your code here
    return 0

if __name__ == "__main__":
    nums = list(map(int, input().split()))
    print(maxSubArray(nums))`,
      java: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        // Write your code here
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
    // Write your code here
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
    }
  },
  {
    id: 3,
    title: "Merge Sorted Arrays",
    starter_code: {
      javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

function merge(nums1, m, nums2, n) {
    // Write your code here - modify nums1 in-place
}

let lines = [];
rl.on('line', (line) => {
    lines.push(line.trim());
    if (lines.length === 4) {
        const nums1 = lines[0].split(' ').map(Number);
        const m = Number(lines[1]);
        const nums2 = lines[2] ? lines[2].split(' ').map(Number) : [];
        const n = Number(lines[3]);
        merge(nums1, m, nums2, n);
        console.log(nums1.slice(0, m + n).join(' '));
        rl.close();
    }
});`,
      python: `def merge(nums1, m, nums2, n):
    # Write your code here - modify nums1 in-place
    pass

if __name__ == "__main__":
    nums1 = list(map(int, input().split()))
    m = int(input())
    nums2_input = input().strip()
    nums2 = list(map(int, nums2_input.split())) if nums2_input else []
    n = int(input())
    merge(nums1, m, nums2, n)
    print(' '.join(map(str, nums1[:m + n])))`,
      java: `import java.util.*;

public class Main {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your code here - modify nums1 in-place
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums1 = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums1[i] = Integer.parseInt(parts[i]);
        int m = Integer.parseInt(sc.nextLine().trim());
        String nums2Str = sc.nextLine().trim();
        int[] nums2 = nums2Str.isEmpty() ? new int[0] : Arrays.stream(nums2Str.split(" ")).mapToInt(Integer::parseInt).toArray();
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
    // Write your code here
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums1;
    int x;
    while (iss >> x) nums1.push_back(x);
    int m, n;
    cin >> m >> n;
    cin.ignore();
    string nums2Line;
    getline(cin, nums2Line);
    vector<int> nums2;
    if (!nums2Line.empty()) {
        istringstream iss2(nums2Line);
        while (iss2 >> x) nums2.push_back(x);
    }
    merge(nums1, m, nums2, n);
    for (int i = 0; i < m + n; i++) {
        if (i > 0) cout << " ";
        cout << nums1[i];
    }
    cout << endl;
    return 0;
}`
    }
  },
  {
    id: 4,
    title: "Reverse Linked List",
    starter_code: {
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    // Write your code here
    return null;
}

// For testing - run from stdin
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', (line) => {
    const arr = line.trim().split(' ').map(Number);
    let head = null, current = null;
    for (let val of arr) {
        if (!head) head = current = new ListNode(val);
        else current = current.next = new ListNode(val);
    }
    const reversed = reverseList(head);
    let result = [];
    while (reversed) {
        result.push(reversed.val);
        reversed = reversed.next;
    }
    console.log(result.join(' '));
    rl.close();
});`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # Write your code here
    return None

if __name__ == "__main__":
    arr = list(map(int, input().split()))
    head = None
    current = None
    for val in arr:
        if not head:
            head = current = ListNode(val)
        else:
            current.next = ListNode(val)
            current = current.next
    reversed_head = reverseList(head)
    result = []
    while reversed_head:
        result.append(str(reversed_head.val))
        reversed_head = reversed_head.next
    print(' '.join(result))`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Main {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return null;
    }

    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        ListNode head = null, current = null;
        for (String p : parts) {
            ListNode node = new ListNode(Integer.parseInt(p));
            if (head == null) head = current = node;
            else current = current.next = node;
        }
        Main sol = new Main();
        ListNode reversed = sol.reverseList(head);
        StringBuilder sb = new StringBuilder();
        while (reversed != null) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(reversed.val);
            reversed = reversed.next;
        }
        System.out.println(sb.toString());
    }
}`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    // Write your code here
    return nullptr;
}

int main() {
    std::string line;
    std::getline(std::cin, line);
    std::istringstream iss(line);
    ListNode* head = nullptr, *current = nullptr;
    int x;
    while (iss >> x) {
        ListNode* node = new ListNode(x);
        if (!head) head = current = node;
        else current = current->next = node;
    }
    ListNode* reversed = reverseList(head);
    bool first = true;
    while (reversed) {
        if (!first) std::cout << " ";
        std::cout << reversed->val;
        reversed = reversed->next;
        first = false;
    }
    std::cout << std::endl;
    return 0;
}`
    }
  }
];

const updateAll = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    for (const update of problemUpdates) {
      const problem = await Problem.findByPk(update.id);
      if (problem) {
        problem.starter_code = JSON.stringify(update.starter_code);
        await problem.save();
        console.log(`✅ Updated: ${update.title}`);
      }
    }

    console.log('\n✅ All problems updated with complete boilerplate!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateAll();
