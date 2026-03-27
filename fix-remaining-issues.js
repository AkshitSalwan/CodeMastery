import sequelize from './server/config/database.js';
import { Problem } from './server/models/index.js';

const fixes = {
  4: {
    java: (code) => {
      if (!code.includes('public class')) {
        return code.replace(/^/, `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

`);
      }
      return code;
    },
    cpp: (code) => code.startsWith('#include') ? code : `#include <bits/stdc++.h>
using namespace std;

${code}`
  },
  5: {
    java: (code) => {
      if (!code.includes('public class')) {
        return code.replace(/^/, `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

`);
      }
      return code;
    },
    cpp: (code) => code.startsWith('#include') ? code : `#include <bits/stdc++.h>
using namespace std;

${code}`
  },
  6: {
    java: (code) => {
      if (!code.includes('public class')) {
        return code.replace(/^/, `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
}

`);
      }
      return code;
    },
    cpp: (code) => code.startsWith('#include') ? code : `#include <bits/stdc++.h>
using namespace std;

${code}`
  },
  7: {
    java: (code) => {
      if (!code.includes('public class')) {
        return code.replace(/^/, `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
}

`);
      }
      return code;
    },
    cpp: (code) => code.startsWith('#include') ? code : `#include <bits/stdc++.h>
using namespace std;

${code}`
  },
  8: {
    java: (code) => {
      if (!code.includes('public class')) {
        return code;
      }
      return code;
    },
    cpp: (code) => code.startsWith('#include') ? code : `#include <bits/stdc++.h>
using namespace std;

${code}`
  },
  9: {
    java: (code) => {
      if (!code.includes('public class')) {
        return code;
      }
      return code;
    },
    cpp: (code) => code.startsWith('#include') ? code : `#include <bits/stdc++.h>
using namespace std;

${code}`
  },
  10: {
    java: (code) => {
      if (!code.includes('public class')) {
        return code;
      }
      return code;
    },
    cpp: (code) => code.startsWith('#include') ? code : `#include <bits/stdc++.h>
using namespace std;

${code}`
  }
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    for (const [idStr, fixFuncs] of Object.entries(fixes)) {
      const id = Number(idStr);
      const problem = await Problem.findByPk(id);
      if (problem) {
        let starterCode = JSON.parse(problem.starter_code);
        
        if (fixFuncs.java) {
          starterCode.java = fixFuncs.java(starterCode.java);
        }
        if (fixFuncs.cpp) {
          starterCode.cpp = fixFuncs.cpp(starterCode.cpp);
        }
        
        problem.starter_code = JSON.stringify(starterCode);
        await problem.save();
        console.log(`✅ Fixed problem ${id}`);
      }
    }

    console.log('\n✅ All fixes applied!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
