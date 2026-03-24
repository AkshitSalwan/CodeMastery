const express = require("express");
const axios = require("axios");

const router = express.Router();

const JUDGE0_URL =
  "http://localhost:2358/submissions?base64_encoded=false&wait=true";

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

function normalize(str) {
  return (str || "").replace(/\s+/g, "").trim();
}

router.post("/", async (req, res) => {
  try {
    const { language, code, testCases } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const language_id = languageMap[language];

    if (!language_id) {
      return res.status(400).json({ error: "Invalid language" });
    }

    // Java validation
    if (language === "java" && !code.includes("class Main") && !code.includes("class Solution")) {
      return res.json({
        status: "Compilation Error",
        compile_output: "Java code must contain 'class Main' or 'class Solution'",
      });
    }

    let results = [];
    let passedTests = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      const response = await axios.post(JUDGE0_URL, {
        source_code: code,
        language_id,
        stdin: tc.input, // ✅ correct stdin
      });

      const data = response.data;

      const actual = (data.stdout || "").trim();
      const expected = (tc.expected || tc.expectedOutput || "").trim();

      const passed = normalize(actual) === normalize(expected);
      if (passed) passedTests++;

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

    res.json({
      status: passedTests === testCases.length ? "Accepted" : "Wrong Answer",
      totalTests: testCases.length,
      passedTests,
      testResults: results,
    });
  } catch (error) {
  console.error("🔥 FULL ERROR:", error);

  if (error.response) {
    console.error("Judge0 Response Error:", error.response.data);
  }

  res.status(500).json({
    error: "Failed to execute code",
    details: error.message,
  });
}
});

module.exports = router;