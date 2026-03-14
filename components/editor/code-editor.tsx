import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import type { Language } from "../../lib/types/problem";
import { monacoLanguages } from "../../lib/editor-utils";

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
  theme = "vs-dark",
  height = "h-96",
  readOnly = false,
}: CodeEditorProps) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${height} bg-secondary rounded-lg flex items-center justify-center`}>
        Loading editor...
      </div>
    );
  }

  return (
    <div className={`${height} rounded-lg border border-border overflow-hidden`}>
      <MonacoEditor
        height="100%"
        language={monacoLanguages[language]}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme={theme}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
        }}
      />
    </div>
  );
}

export default CodeEditor;