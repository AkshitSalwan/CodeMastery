import type { Language } from '@/lib/types/problem';

export const languageInfo: Record<Language, { name: string; ext: string }> = {
  javascript: { name: 'JavaScript', ext: 'js' },
  python: { name: 'Python', ext: 'py' },
  java: { name: 'Java', ext: 'java' },
  cpp: { name: 'C++', ext: 'cpp' },
};

export const monacoLanguages: Record<Language, string> = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
};

export function formatCode(code: string): string {
  // Basic code formatting
  return code.split('\n').map(line => line.trimEnd()).join('\n');
}

export function validateSyntax(code: string, language: Language): string | null {
  // Mock validation - in a real app, this would use a proper linter
  if (code.trim().length === 0) {
    return 'Code cannot be empty';
  }

  // Very lightweight language-specific checks to catch obvious mistakes
  if (language === 'java') {
    // Common HashMap typo in Java solutions
    if (code.includes('HashMap') && code.includes('map.ut(')) {
      return 'Cannot resolve method ut on HashMap (did you mean put?)';
    }
  }

  return null;
}
