require('dotenv').config();

const express = require('express');
const path = require('path');
const judgeService = require('./services/judgeService');
const compareOutput = require('./utils/compareOutput');
const learnersPlatformRouter = require('../learners-platform/backend');

function buildJavaDriver(code) {
  const methodMatch = code.match(/public\s+\w+\s+(\w+)\s*\(/);
  const methodName = methodMatch ? methodMatch[1] : 'twoSum';

  return `
import java.util.*;
import java.io.*;

${code}

public class Main {
  public static void main(String[] args) throws Exception {
    Scanner sc = new Scanner(System.in);

    Solution s = new Solution();

    String[] parts = sc.nextLine().trim().split(" ");
    int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();

    int target = Integer.parseInt(sc.nextLine().trim());

    int[] result = s.${methodName}(nums, target);

    System.out.println(Arrays.toString(result));
  }
}
`;
}

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/learners-platform', learnersPlatformRouter);

  app.post('/api/run', async (req, res) => {
    const { language, code, testCases, stdin } = req.body || {};

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing code or language' });
    }

    const processedCode =
      language === 'java' && !/public\s+class\s+Main\b/.test(code)
        ? buildJavaDriver(code)
        : code;

    try {
      if (!testCases || testCases.length === 0) {
        const data = await judgeService.runJudge(language, processedCode, stdin || '');
        return res.json(data);
      }

      const results = [];
      let passedTests = 0;

      for (const testCase of testCases) {
        const data = await judgeService.runJudge(language, processedCode, testCase.input);
        const actual = (data.compile_output || data.stderr || data.stdout || '').trim();
        const expected = String(testCase.expected || '').trim();
        const passed = compareOutput(actual, expected);

        if (passed) {
          passedTests++;
        }

        results.push({
          input: testCase.input,
          expected,
          actual,
          passed,
          runtime: data.time || null,
          memory: data.memory || null,
          error: data.stderr || data.compile_output || null,
        });
      }

      return res.json({
        status: passedTests === testCases.length ? 'Accepted' : 'Wrong Answer',
        totalTests: testCases.length,
        passedTests,
        testResults: results,
      });
    } catch (error) {
      console.error('Judge0 error:', error);

      return res.status(500).json({
        error: 'Failed to execute code',
      });
    }
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');

    app.use(express.static(distPath));

    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

function startServer(port = Number(process.env.PORT) || 4000) {
  const app = createApp();

  return app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createApp,
  startServer,
};
