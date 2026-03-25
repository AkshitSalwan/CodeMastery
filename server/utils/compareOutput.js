export default function compareOutput(actual, expected) {
  if (actual == null || expected == null) return false;

  // Normalize whitespace
  const normalize = (str) =>
    str
      .toString()
      .trim()
      .replace(/\r/g, "")
      .split("\n")
      .map(line => line.trim())
      .join("\n");

  return normalize(actual) === normalize(expected);
};