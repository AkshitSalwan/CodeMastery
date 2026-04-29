import sequelize from './server/config/database.js';
import { Problem } from './server/models/index.js';

const requiredBoilerplates = {
  java: ['public class', 'public static void main', 'Scanner'],
  python: ['def ', 'if __name__'],
  javascript: ['function', 'readline'],
  cpp: ['#include', 'main']
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Fetch all problems
    const problems = await Problem.findAll();
    console.log(`📊 Total problems found: ${problems.length}\n`);

    let totalChecks = 0;
    let passedChecks = 0;
    const issuesFound = [];

    problems.forEach((problem, index) => {
      console.log(`\n📝 Problem ${index + 1}: "${problem.title}" (ID: ${problem.id})`);
      console.log('─'.repeat(60));

      if (!problem.starter_code) {
        console.log('❌ NO STARTER CODE');
        issuesFound.push(`Problem ${problem.id}: Missing starter_code field`);
        return;
      }

      let starterCode;
      try {
        starterCode = typeof problem.starter_code === 'string' 
          ? JSON.parse(problem.starter_code)
          : problem.starter_code;
      } catch (e) {
        console.log('❌ INVALID JSON in starter_code');
        issuesFound.push(`Problem ${problem.id}: Invalid JSON in starter_code`);
        return;
      }

      // Check each language
      Object.entries(requiredBoilerplates).forEach(([lang, requirements]) => {
        totalChecks++;
        const code = starterCode[lang];
        
        if (!code) {
          console.log(`  ❌ ${lang.toUpperCase()}: Missing`);
          issuesFound.push(`Problem ${problem.id}: Missing ${lang} code`);
          return;
        }

        const hasAll = requirements.every(req => code.includes(req));
        
        if (hasAll) {
          console.log(`  ✅ ${lang.toUpperCase()}: Complete boilerplate`);
          passedChecks++;
        } else {
          const missing = requirements.filter(req => !code.includes(req));
          console.log(`  ⚠️  ${lang.toUpperCase()}: Missing ${missing.join(', ')}`);
          issuesFound.push(`Problem ${problem.id} (${lang}): Missing ${missing.join(', ')}`);
        }
      });
    });

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📈 SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Total boilerplate checks: ${totalChecks}`);
    console.log(`Passed checks: ${passedChecks}/${totalChecks}`);
    console.log(`Success rate: ${((passedChecks/totalChecks)*100).toFixed(1)}%`);

    if (issuesFound.length === 0) {
      console.log('\n✅ All problems have proper boilerplate!');
    } else {
      console.log(`\n⚠️  Issues found (${issuesFound.length}):`);
      issuesFound.forEach(issue => console.log(`  - ${issue}`));
    }

    process.exit(issuesFound.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
