const languageMap = require("../utils/languageMap");

// Ensure fetch exists (Node 18+ has it built in)
let fetch = globalThis.fetch;

if (!fetch) {
  fetch = require("node-fetch");
}

exports.runJudge = async (language, code, stdin) => {
  const language_id = languageMap[language];

  if (!language_id) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const judgeBaseUrl = (process.env.JUDGE0_BASE_URL || "https://ce.judge0.com").replace(/\/$/, "");
  const submissionUrl = `${judgeBaseUrl}/submissions?base64_encoded=false&wait=true`;

  const response = await fetch(
    submissionUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout
        ? AbortSignal.timeout(30000)
        : undefined,
      body: JSON.stringify({
        source_code: code,
        language_id,
        stdin
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Judge0 API error: ${response.status}`);
  }

  const data = await response.json();

  return data;
};
