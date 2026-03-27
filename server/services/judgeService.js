import languageMap from "../utils/languageMap.js";

let fetch = globalThis.fetch;

// fetch is built-in to Node.js 18+, no need to require node-fetch

const JUDGE_TERMINAL_STATUS_ID = 2;
const DEFAULT_POLL_ATTEMPTS = Number(process.env.JUDGE0_POLL_ATTEMPTS || 20);
const DEFAULT_POLL_INTERVAL_MS = Number(process.env.JUDGE0_POLL_INTERVAL_MS || 750);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const encodeBase64 = (value) => Buffer.from(String(value ?? ""), "utf8").toString("base64");
const decodeBase64 = (value) => {
  if (value == null) {
    return value;
  }

  try {
    return Buffer.from(String(value), "base64").toString("utf8");
  } catch {
    return value;
  }
};

const normalizeJudgeResponse = (data) => ({
  ...data,
  stdout: decodeBase64(data.stdout),
  stderr: decodeBase64(data.stderr),
  compile_output: decodeBase64(data.compile_output),
  message: decodeBase64(data.message),
});

const parseJudgeError = async (response) => {
  const text = await response.text();

  if (!text) {
    return `Judge0 API error: ${response.status}`;
  }

  try {
    const data = JSON.parse(text);
    return data.error || data.message || `Judge0 API error: ${response.status}`;
  } catch {
    return text;
  }
};

const pollSubmission = async (judgeBaseUrl, token) => {
  const statusUrl = `${judgeBaseUrl}/submissions/${token}?base64_encoded=true&fields=stdout,time,memory,stderr,token,compile_output,message,status`;

  for (let attempt = 0; attempt < DEFAULT_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetch(statusUrl, {
      signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout
        ? AbortSignal.timeout(15000)
        : undefined,
    });

    if (!response.ok) {
      throw new Error(await parseJudgeError(response));
    }

    const data = normalizeJudgeResponse(await response.json());

    if (data.status?.id > JUDGE_TERMINAL_STATUS_ID) {
      return data;
    }

    await delay(DEFAULT_POLL_INTERVAL_MS);
  }

  throw new Error("Judge0 polling timed out before execution completed");
};

export const runJudge = async (language, code, stdin) => {
  const language_id = languageMap[language];

  if (!language_id) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const judgeBaseUrl = (process.env.JUDGE0_BASE_URL || "https://ce.judge0.com").replace(/\/$/, "");
  const submissionUrl = `${judgeBaseUrl}/submissions?base64_encoded=true`;

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
        source_code: encodeBase64(code),
        language_id,
        stdin: encodeBase64(stdin)
      })
    }
  );

  if (!response.ok) {
    throw new Error(await parseJudgeError(response));
  }

  const data = normalizeJudgeResponse(await response.json());

  if (data.status?.id > JUDGE_TERMINAL_STATUS_ID) {
    return data;
  }

  if (!data.token) {
    throw new Error("Judge0 did not return a submission token");
  }

  return pollSubmission(judgeBaseUrl, data.token);
};

// Get language ID from language name
export const getLanguageId = (language) => {
  return languageMap[language.toLowerCase()] || null;
};

// Execute code with test case input
export const executeCode = async (code, language, testInput = '') => {
  const language_id = getLanguageId(language);
  if (!language_id) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const judgeBaseUrl = (process.env.JUDGE0_BASE_URL || "https://ce.judge0.com").replace(/\/$/, "");
  const submissionUrl = `${judgeBaseUrl}/submissions?base64_encoded=true`;

  const response = await fetch(submissionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout
      ? AbortSignal.timeout(30000)
      : undefined,
    body: JSON.stringify({
      source_code: encodeBase64(code),
      language_id,
      stdin: encodeBase64(testInput)
    })
  });

  if (!response.ok) {
    throw new Error(await parseJudgeError(response));
  }

  const data = normalizeJudgeResponse(await response.json());

  if (!data.token) {
    throw new Error("Judge0 did not return a submission token");
  }

  return pollSubmission(judgeBaseUrl, data.token);
};

export default {
  runJudge,
  getLanguageId,
  executeCode
};
