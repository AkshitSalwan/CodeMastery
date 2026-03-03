'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import type { Language } from '../../lib/types/problem';
import { monacoLanguages } from '../../lib/editor-utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading editor...</div>,
});

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  theme?: string;
  height?: string;
  readOnly?: boolean;
};

export function CodeEditor({
  value,
  onChange,
  language,
  theme,
  height = 'h-96',
  readOnly = false,
}: CodeEditorProps) {
  const { theme: themeMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`${height} bg-secondary rounded-lg flex items-center justify-center`}>
      Loading editor...
    </div>;
  }

  const monacoTheme = themeMode === 'dark' ? 'vs-dark' : 'vs-light';

  return (
    <div className={`${height} rounded-lg border border-border overflow-hidden`}>
      <MonacoEditor
        height="100%"
        language={monacoLanguages[language]}
        value={value}
        onChange={(val) => onChange(val || '')}
        theme={theme || monacoTheme}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Fira Code, monospace',
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
