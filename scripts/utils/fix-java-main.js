import sequelize from './server/config/database.js';
import { Problem } from './server/models/index.js';

// Map of problem ID -> correct Java code with proper Main class wrapper
const correctJavaCode = {
  4: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Main {
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
  5: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Main {
    public boolean hasCycle(ListNode head) {
        // Write your code here
        return false;
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
        boolean result = sol.hasCycle(head);
        System.out.println(result ? "true" : "false");
    }
}`,
  6: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
}

public class Main {
    public java.util.List<Integer> inorderTraversal(TreeNode root) {
        // Write your code here
        return new java.util.ArrayList<>();
    }

    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        String[] arr = sc.nextLine().trim().split(" ");
        java.util.List<TreeNode> nodes = new java.util.ArrayList<>();
        for (String s : arr) {
            nodes.add(s.equals("null") ? null : new TreeNode(Integer.parseInt(s)));
        }
        TreeNode root = nodes.isEmpty() ? null : nodes.get(0);
        for (int i = 0; i < nodes.size(); i++) {
            if (nodes.get(i) != null) {
                if (2 * i + 1 < nodes.size()) nodes.get(i).left = nodes.get(2 * i + 1);
                if (2 * i + 2 < nodes.size()) nodes.get(i).right = nodes.get(2 * i + 2);
            }
        }
        Main sol = new Main();
        java.util.List<Integer> result = sol.inorderTraversal(root);
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(result.get(i));
        }
        System.out.println();
    }
}`,
  7: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
}

public class Main {
    public int maxDepth(TreeNode root) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        sc.nextLine();
        Main sol = new Main();
        System.out.println(sol.maxDepth(null));
    }
}`,
  8: `public class Main {
    public int numIslands(char[][] grid) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        int rows = Integer.parseInt(sc.nextLine());
        char[][] grid = new char[rows][];
        for (int i = 0; i < rows; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            grid[i] = new char[parts.length];
            for (int j = 0; j < parts.length; j++) {
                grid[i][j] = parts[j].charAt(0);
            }
        }
        Main sol = new Main();
        System.out.println(sol.numIslands(grid));
    }
}`,
  9: `public class Main {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Main sol = new Main();
        System.out.println(sol.climbStairs(n));
    }
}`,
  10: `public class Main {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }

    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] coins = new int[parts.length];
        for (int i = 0; i < parts.length; i++) coins[i] = Integer.parseInt(parts[i]);
        int amount = Integer.parseInt(sc.nextLine().trim());
        Main sol = new Main();
        System.out.println(sol.coinChange(coins, amount));
    }
}`
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    for (const [idStr, javaCode] of Object.entries(correctJavaCode)) {
      const id = Number(idStr);
      const problem = await Problem.findByPk(id);
      if (problem) {
        let starterCode = JSON.parse(problem.starter_code);
        starterCode.java = javaCode;
        problem.starter_code = JSON.stringify(starterCode);
        await problem.save();
        console.log(`✅ Fixed Java code for problem ${id}`);
      }
    }

    console.log('\n✅ All Java code fixed with proper Main class wrappers!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
