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
    const { language, code, testCases } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: "Language and code are required" });
    }

    const language_id = languageMap[language];
    if (!language_id) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ error: "No test cases provided" });
    }

    let results = [];
    let passedTests = 0;
    let totalRuntime = 0;
    let totalMemory = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      console.log(`Running Test Case ${i + 1}: Input ->`, tc.input);

      const response = await axios.post(JUDGE0_URL, {
        source_code: code,
        language_id,
        stdin: tc.input,
      });

      const data = response.data;

      // Logs to debug what Judge0 returns
      console.log(`Judge0 response for Test ${i + 1}:`, data);

      const actual = (data.stdout || "").trim();
      const expected = tc.expected.trim();

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
      });
    }

    const finalStatus =
      passedTests === testCases.length ? "Accepted" : "Wrong Answer";

    console.log(
      `Final Result: ${passedTests}/${testCases.length} passed, Status: ${finalStatus}`
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