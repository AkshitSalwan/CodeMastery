/**
 * Normalize output for comparison
 * Handles both structured output (JSON arrays/objects) and space-separated values
 */
export const normalizeOutput = (output) => {
  if (!output) return '';
  
  const trimmed = String(output).trim();
  
  // For JSON arrays/objects, remove all whitespace
  if (
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
  ) {
    return trimmed.replace(/\s+/g, '');
  }
  
  // For space-separated values (like "1 2 3"), normalize spacing
  // Split by whitespace, filter empty strings, and rejoin with single space
  return trimmed
    .split(/\s+/)
    .filter(val => val.length > 0)
    .join(' ');
};

/**
 * Compare two outputs with smart normalization
 * Handles arrays, objects, and space-separated values
 */
export const compareOutputs = (actual, expected) => {
  const actualNorm = normalizeOutput(actual);
  const expectedNorm = normalizeOutput(expected);
  
  return actualNorm === expectedNorm;
};

export default {
  normalizeOutput,
  compareOutputs
};
