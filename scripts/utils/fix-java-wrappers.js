import sequelize from './server/config/database.js';
import { Problem } from './server/models/index.js';

const javaFixes = {
  4: (code) => {
    const classNodeDef = `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}`;
    
    return `${classNodeDef}

public class Main {${code.substring(code.indexOf('public') + 'public'.length, code.lastIndexOf('}') + 1)}}`;
  },
  5: (code) => {
    const classNodeDef = `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}`;
    
    // Extract the method and wrap
    const methodStart = code.indexOf('public boolean');
    const mainStart = code.indexOf('public static void main');
    
    if (mainStart > -1) {
      const method = code.substring(methodStart, mainStart);
      const main = code.substring(mainStart);
      return `${classNodeDef}

public class Main {
    ${method}
    
    ${main}
}`;
    }
    return code;
  },
  6: (code) => {
    const classNodeDef = `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
}`;
    
    const methodStart = code.indexOf('public java.util.List');
    const mainStart = code.indexOf('public static void main');
    
    if (mainStart > -1) {
      const method = code.substring(methodStart, mainStart);
      const main = code.substring(mainStart);
      return `${classNodeDef}

public class Main {
    ${method}
    
    ${main}
}`;
    }
    return code;
  },
  7: (code) => {
    const classNodeDef = `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
}`;
    
    const methodStart = code.indexOf('public int');
    const mainStart = code.indexOf('public static void main');
    
    if (mainStart > -1) {
      const method = code.substring(methodStart, mainStart);
      const main = code.substring(mainStart);
      return `${classNodeDef}

public class Main {
    ${method}
    
    ${main}
}`;
    }
    return code;
  },
  8: (code) => {
    const methodStart = code.indexOf('public int');
    const mainStart = code.indexOf('public static void main');
    
    if (mainStart > -1) {
      const method = code.substring(methodStart, mainStart);
      const main = code.substring(mainStart);
      return `public class Main {
    ${method}
    
    ${main}
}`;
    }
    return code;
  },
  9: (code) => {
    const methodStart = code.indexOf('public int');
    const mainStart = code.indexOf('public static void main');
    
    if (mainStart > -1) {
      const method = code.substring(methodStart, mainStart);
      const main = code.substring(mainStart);
      return `public class Main {
    ${method}
    
    ${main}
}`;
    }
    return code;
  },
  10: (code) => {
    const methodStart = code.indexOf('public int');
    const mainStart = code.indexOf('public static void main');
    
    if (mainStart > -1) {
      const method = code.substring(methodStart, mainStart);
      const main = code.substring(mainStart);
      return `public class Main {
    ${method}
    
    ${main}
}`;
    }
    return code;
  }
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    for (const [idStr, fixer] of Object.entries(javaFixes)) {
      const id = Number(idStr);
      const problem = await Problem.findByPk(id);
      if (problem) {
        let starterCode = JSON.parse(problem.starter_code);
        starterCode.java = fixer(starterCode.java);
        problem.starter_code = JSON.stringify(starterCode);
        await problem.save();
        console.log(`✅ Fixed Java class wrapper for problem ${id}`);
      }
    }

    console.log('\n✅ All Java wrappers fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
