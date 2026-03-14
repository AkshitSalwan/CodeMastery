require('dotenv').config();
const express = require('express');
const path = require('path');
const judgeService = require('./services/judgeService');

const app = express();
app.use(express.json());

/* ---------------- HEALTH CHECK ---------------- */

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* ---------------- RUN CODE ---------------- */

app.post('/api/run', async (req, res) => {
  const { language, code, testCases, stdin } = req.body || {};

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing code or language' });
  }

  let processedCode = code;

  /* -------- JAVA DRIVER WRAPPER -------- */

  if (language === 'java') {
  const methodMatch = code.match(/public\s+\w+\s+(\w+)\s*\(/);
  const methodName = methodMatch ? methodMatch[1] : 'twoSum';

  processedCode = `
import java.util.*;
import java.io.*;

${code}

public class Main {
  public static void main(String[] args) throws Exception {
    Scanner sc = new Scanner(System.in);

    Solution s = new Solution();

    // Read first line as array of integers
    String[] parts = sc.nextLine().trim().split(" ");
    int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();

    // Read second line as integer target
    int target = Integer.parseInt(sc.nextLine().trim());

    int[] result = s.${methodName}(nums, target);

    System.out.println(Arrays.toString(result));
  }
}
`;
}

  try {

    /* -------- SINGLE EXECUTION (Run Button) -------- */

    if (!testCases || testCases.length === 0) {

      const data = await judgeService.runJudge(language, processedCode, stdin || '');

      return res.json(data);
    }

    /* -------- TESTCASE MODE (Submit Button) -------- */

    let results = [];
    let passedTests = 0;

    for (const tc of testCases) {

      const data = await judgeService.runJudge(language, processedCode, tc.input);

      const actual = (data.stdout || "").trim();
      const expected = tc.expected.trim();

      const passed = actual === expected;

      if (passed) passedTests++;

      results.push({
        input: tc.input,
        expected,
        actual,
        passed
      });
    }

    return res.json({
      status: passedTests === testCases.length ? "Accepted" : "Wrong Answer",
      totalTests: testCases.length,
      passedTests,
      testResults: results
    });

  } catch (err) {

    console.error('Judge0 error:', err);

    return res.status(500).json({
      error: 'Failed to execute code'
    });
  }
});

/* ---------------- PRODUCTION FRONTEND ---------------- */

if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

}

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});