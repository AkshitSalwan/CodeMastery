const express = require("express");
const axios = require("axios");

const router = express.Router();

// Judge0 local API
const JUDGE0_URL =
  "http://localhost:2358/submissions?base64_encoded=false&wait=true";

// Judge0 Language IDs
const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

// Normalize output for comparison
function normalize(str) {
  return (str || "").replace(/\s+/g, "").replace(/\r/g, "").trim();
}

// Compare actual vs expected
function compareOutput(actual, expected) {
  return normalize(actual) === normalize(expected);
}

router.post("/", async (req, res) => {
  try {
    let { language, code, testCases, stdin } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: "Language and code are required" });
    }

    const language_id = languageMap[language];
    if (!language_id) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    // Handle single run (stdin provided)
    if (stdin !== undefined) {
      console.log(`Running single code execution with stdin: ${stdin}`);

      let sourceCode = code;
      if (language === 'java') {
        const count = (code.match(/class Main/g) || []).length;
        if (count > 1) {
          return res.json({
            status: "Compilation Error",
            compile_output: "Duplicate class Main. Do not add class declarations in your code.",
          });
        }
      }

      const response = await axios.post(JUDGE0_URL, {
        source_code: sourceCode,
        language_id,
        stdin: stdin,
      });

      const data = response.data;
      console.log(`Judge0 response:`, data);

      const status = data.status?.description || 'Unknown';
      const time = data.time != null ? `${data.time}s` : 'N/A';
      const memory = data.memory != null ? `${data.memory} KB` : 'N/A';

      if (data.compile_output) {
        return res.json({
          status: "Compilation Error",
          compile_output: data.compile_output,
          time,
          memory,
        });
      } else if (data.stderr) {
        return res.json({
          status: "Runtime Error",
          stderr: data.stderr,
          time,
          memory,
        });
      } else {
        const stdout = data.stdout || '';
        return res.json({
          status: "Accepted",
          stdout,
          time,
          memory,
        });
      }
    }

    // Handle multiple test cases
    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ error: "No test cases provided" });
    }

    let results = [];
    let passedTests = 0;
    let totalRuntime = 0;
    let totalMemory = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      console.log(`Running Test Case ${i + 1}`);

      let sourceCode = code;
      if (language === 'java') {
        const count = (code.match(/class Main/g) || []).length;
        if (count > 1) {
          results.push({
            status: "Compilation Error",
            compile_output: "Duplicate class Main. Do not add class declarations in your code.",
            time: "N/A",
            memory: "N/A",
            passed: false,
          });
          continue;
        }
      }

      const payload = {
        source_code: sourceCode,
        language_id,
        stdin: tc.input,
      };

      const response = await axios.post(JUDGE0_URL, payload);

      const data = response.data;

      console.log(`Judge0 Response Test ${i + 1}:`, data);

      const actual = (data.stdout || "").trim();
      const expected = (tc.expected || "").trim();

      const passed = compareOutput(actual, expected);
      if (passed) passedTests++;

      totalRuntime = data.time ? Math.round(parseFloat(data.time) * 1000) : 0;
      totalMemory = data.memory || 0;

      results.push({
        testNum: i + 1,
        input: tc.input,
        expected,
        actual,
        passed,
        error: data.stderr || data.compile_output || null,
        runtime: data.time,
        memory: data.memory,
      });
    }

    const finalStatus =
      passedTests === testCases.length ? "Accepted" : "Wrong Answer";

    console.log(
      `Final Result: ${passedTests}/${testCases.length} passed`
    );

    res.json({
      status: finalStatus,
      runtime: totalRuntime,
      memory: totalMemory,
      totalTests: testCases.length,
      passedTests,
      testResults: results,
    });
  } catch (error) {
    console.error("Run Error:", error.message);

    res.status(500).json({
      status: "Runtime Error",
      error: "Execution failed",
      details: error.message,
    });
  }
});

module.exports = router;