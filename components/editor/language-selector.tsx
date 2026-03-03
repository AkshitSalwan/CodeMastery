'use client';

import type { Language } from '../../lib/types/problem';
import { languageInfo } from '../../lib/editor-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

type LanguageSelectorProps = {
  value: Language;
  onChange: (language: Language) => void;
};

const languages: Language[] = ['javascript', 'python', 'java', 'cpp'];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as Language)}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {languageInfo[lang].name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
