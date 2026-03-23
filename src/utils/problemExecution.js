const splitTopLevel = (input, delimiter = ',') => {
  const parts = [];
  let current = '';
  let depthSquare = 0;
  let depthRound = 0;
  let depthCurly = 0;
  let inString = false;
  let stringQuote = '';

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const previous = input[index - 1];

    if ((character === '"' || character === "'") && previous !== '\\') {
      if (!inString) {
        inString = true;
        stringQuote = character;
      } else if (stringQuote === character) {
        inString = false;
        stringQuote = '';
      }
    }

    if (!inString) {
      if (character === '[') depthSquare += 1;
      if (character === ']') depthSquare -= 1;
      if (character === '(') depthRound += 1;
      if (character === ')') depthRound -= 1;
      if (character === '{') depthCurly += 1;
      if (character === '}') depthCurly -= 1;
    }

    if (
      character === delimiter &&
      !inString &&
      depthSquare === 0 &&
      depthRound === 0 &&
      depthCurly === 0
    ) {
      parts.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
};

const parseLiteral = (rawValue) => {
  const value = String(rawValue || '').trim();

  if (!value) {
    return '';
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value === 'null' || value === 'None') return null;
  if (value === 'true' || value === 'True') return true;
  if (value === 'false' || value === 'False') return false;

  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return splitTopLevel(inner).map(parseLiteral);
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  return value;
};

const parseAssignmentInput = (input) =>
  splitTopLevel(String(input || '')).map((segment, index) => {
    const equalsIndex = segment.indexOf('=');
    if (equalsIndex === -1) {
      return {
        name: `arg${index}`,
        value: parseLiteral(segment),
      };
    }

    return {
      name: segment.slice(0, equalsIndex).trim(),
      value: parseLiteral(segment.slice(equalsIndex + 1).trim()),
    };
  });

const toJavaScriptLiteral = (value) => JSON.stringify(value);

const toPythonLiteral = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map((item) => toPythonLiteral(item)).join(', ')}]`;
  }

  if (value === null) return 'None';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  return String(value);
};

const toJavaLiteral = (value) => {
  if (Array.isArray(value)) {
    return `new int[]{${value.map((item) => toJavaLiteral(item)).join(', ')}}`;
  }

  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
};

const toCppLiteral = (value) => {
  if (Array.isArray(value)) {
    return `{${value.map((item) => toCppLiteral(item)).join(', ')}}`;
  }

  if (value === null) return 'nullptr';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
};

const normalizeOutput = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  if (
    (normalized.startsWith('[') && normalized.endsWith(']')) ||
    (normalized.startsWith('{') && normalized.endsWith('}'))
  ) {
    return normalized.replace(/\s+/g, '');
  }

  return normalized;
};

const compareExecutionOutput = (actual, expected) => normalizeOutput(actual) === normalizeOutput(expected);

const extractJavaScriptFunctionName = (code) => {
  const functionMatch = code.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);
  if (functionMatch) return functionMatch[1];

  const constMatch = code.match(/const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(/);
  if (constMatch) return constMatch[1];

  const arrowMatch = code.match(/(?:let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(/);
  if (arrowMatch) return arrowMatch[1];

  return null;
};

const extractPythonFunctionName = (code) => {
  const functionMatch = code.match(/def\s+([A-Za-z_][\w]*)\s*\(/);
  return functionMatch ? functionMatch[1] : null;
};

const extractJavaSignature = (code) => {
  const match = code.match(/public\s+([A-Za-z_$][\w$<>\[\]]*)\s+([A-Za-z_$][\w$]*)\s*\(/);
  if (!match) return null;

  return {
    returnType: match[1],
    methodName: match[2],
  };
};

const extractCppSignature = (code) => {
  const matches = [...code.matchAll(/(?:public:\s*)?([A-Za-z_][\w:<>]*\s*[*&]?)\s+([A-Za-z_]\w*)\s*\([^)]*\)\s*\{/g)];
  const methodMatch = matches.find((match) => match[2] !== 'Solution' && match[1] !== 'class');

  if (!methodMatch) return null;

  return {
    returnType: methodMatch[1].trim(),
    methodName: methodMatch[2],
  };
};

const buildJavaScriptArgs = (assignments) =>
  assignments
    .map(({ name, value }) => {
      const literal = toJavaScriptLiteral(value);

      if (/^l\d+$/i.test(name)) {
        return `buildLinkedList(${literal})`;
      }

      return literal;
    })
    .join(', ');

const buildPythonArgs = (assignments) =>
  assignments
    .map(({ name, value }) => {
      const literal = toPythonLiteral(value);

      if (/^l\d+$/i.test(name)) {
        return `build_linked_list(${literal})`;
      }

      return literal;
    })
    .join(', ');

const buildJavaArgs = (assignments) =>
  assignments
    .map(({ name, value }) => {
      if (/^l\d+$/i.test(name)) {
        return `buildLinkedList(${toJavaLiteral(value)})`;
      }

      return toJavaLiteral(value);
    })
    .join(', ');

const buildCppArgs = (assignments) =>
  assignments
    .map(({ name, value }) => {
      if (/^l\d+$/i.test(name)) {
        return `buildLinkedList(${toCppLiteral(value)})`;
      }

      return toCppLiteral(value);
    })
    .join(', ');

const buildJavaScriptExecutionCode = (code, testCaseInput) => {
  const functionName = extractJavaScriptFunctionName(code);
  if (!functionName) {
    return code;
  }

  const args = buildJavaScriptArgs(parseAssignmentInput(testCaseInput));

  return `
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function buildLinkedList(values = []) {
  const dummy = new ListNode(0);
  let current = dummy;
  for (const value of values) {
    current.next = new ListNode(value);
    current = current.next;
  }
  return dummy.next;
}

function serializeResult(value) {
  if (value && typeof value === 'object' && 'val' in value && 'next' in value) {
    const result = [];
    let current = value;
    while (current) {
      result.push(current.val);
      current = current.next;
    }
    return result;
  }

  return value;
}

function printResult(value) {
  const normalized = serializeResult(value);
  if (Array.isArray(normalized) || (normalized && typeof normalized === 'object')) {
    console.log(JSON.stringify(normalized));
    return;
  }
  console.log(String(normalized));
}

${code}

const __result = ${functionName}(${args});
printResult(__result);
`;
};

const buildPythonExecutionCode = (code, testCaseInput) => {
  const functionName = extractPythonFunctionName(code);
  if (!functionName) {
    return code;
  }

  const args = buildPythonArgs(parseAssignmentInput(testCaseInput));

  return `
import json

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_linked_list(values):
    dummy = ListNode(0)
    current = dummy
    for value in values:
        current.next = ListNode(value)
        current = current.next
    return dummy.next

def serialize_result(value):
    if hasattr(value, 'val') and hasattr(value, 'next'):
        result = []
        current = value
        while current is not None:
            result.append(current.val)
            current = current.next
        return result
    return value

${code}

__result = ${functionName}(${args})
__normalized = serialize_result(__result)

if isinstance(__normalized, (list, dict)):
    print(json.dumps(__normalized, separators=(',', ':')))
else:
    print(str(__normalized))
`;
};

const buildJavaResultPrinter = (returnType) => {
  if (returnType === 'int[]') {
    return 'System.out.print(Arrays.toString(result).replace(" ", ""));';
  }

  if (returnType === 'ListNode') {
    return 'System.out.print(serializeLinkedList(result));';
  }

  if (returnType.includes('List')) {
    return 'System.out.print(String.valueOf(result).replace(" ", ""));';
  }

  return 'System.out.print(String.valueOf(result));';
};

const buildJavaExecutionCode = (code, testCaseInput) => {
  const signature = extractJavaSignature(code);
  if (!signature) {
    return code;
  }

  const args = buildJavaArgs(parseAssignmentInput(testCaseInput));
  const printResult = buildJavaResultPrinter(signature.returnType);

  return `
import java.util.*;

class ListNode {
  int val;
  ListNode next;
  ListNode() {}
  ListNode(int val) { this.val = val; }
  ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

${code}

public class Main {
  static ListNode buildLinkedList(int[] values) {
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    for (int value : values) {
      current.next = new ListNode(value);
      current = current.next;
    }
    return dummy.next;
  }

  static String serializeLinkedList(ListNode node) {
    List<Integer> values = new ArrayList<>();
    while (node != null) {
      values.add(node.val);
      node = node.next;
    }
    return values.toString().replace(" ", "");
  }

  public static void main(String[] args) {
    Solution solution = new Solution();
    ${signature.returnType} result = solution.${signature.methodName}(${args});
    ${printResult}
  }
}
`;
};

const buildCppResultPrinter = (returnType) => {
  if (returnType.includes('vector<vector<int>>')) {
    return 'printNestedVector(result);';
  }

  if (returnType.includes('vector<int>')) {
    return 'printVector(result);';
  }

  if (returnType.includes('ListNode')) {
    return 'cout << serializeLinkedList(result);';
  }

  return 'cout << result;';
};

const buildCppExecutionCode = (code, testCaseInput) => {
  const signature = extractCppSignature(code);
  if (!signature) {
    return code;
  }

  const args = buildCppArgs(parseAssignmentInput(testCaseInput));
  const printResult = buildCppResultPrinter(signature.returnType);

  return `
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
  int val;
  ListNode *next;
  ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* buildLinkedList(const vector<int>& values) {
  ListNode dummy(0);
  ListNode* current = &dummy;
  for (int value : values) {
    current->next = new ListNode(value);
    current = current->next;
  }
  return dummy.next;
}

string serializeLinkedList(ListNode* node) {
  string result = "[";
  bool first = true;
  while (node != nullptr) {
    if (!first) result += ",";
    first = false;
    result += to_string(node->val);
    node = node->next;
  }
  result += "]";
  return result;
}

void printVector(const vector<int>& values) {
  cout << "[";
  for (size_t index = 0; index < values.size(); ++index) {
    if (index > 0) cout << ",";
    cout << values[index];
  }
  cout << "]";
}

void printNestedVector(const vector<vector<int>>& values) {
  cout << "[";
  for (size_t index = 0; index < values.size(); ++index) {
    if (index > 0) cout << ",";
    printVector(values[index]);
  }
  cout << "]";
}

${code}

int main() {
  Solution solution;
  ${signature.returnType} result = solution.${signature.methodName}(${args});
  ${printResult}
  return 0;
}
`;
};

export const buildExecutionCode = ({ language, code, testCaseInput }) => {
  if (language === 'javascript') {
    return buildJavaScriptExecutionCode(code, testCaseInput);
  }

  if (language === 'python') {
    return buildPythonExecutionCode(code, testCaseInput);
  }

  if (language === 'java') {
    return buildJavaExecutionCode(code, testCaseInput);
  }

  if (language === 'cpp') {
    return buildCppExecutionCode(code, testCaseInput);
  }

  return code;
};

export { compareExecutionOutput, parseAssignmentInput };
