'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

type AiHintPanelProps = {
  hints: string[];
  explanation: string;
};

export function AiHintPanel({ hints, explanation }: AiHintPanelProps) {
  const [expandedHints, setExpandedHints] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [displayedHints, setDisplayedHints] = useState<string[]>([]);

  const toggleHint = (index: number) => {
    if (expandedHints < index + 1) {
      // Unlock hints progressively
      const newHints = hints.slice(0, index + 1);
      setDisplayedHints(newHints);
      setExpandedHints(index + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          AI Hints & Solutions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hints */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Progressive Hints</p>
          <div className="space-y-2">
            {hints.map((hint, index) => (
              <button
                key={index}
                onClick={() => toggleHint(index)}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Hint {index + 1}
                  </span>
                  {expandedHints > index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                {expandedHints > index && (
                  <p className="text-sm text-muted-foreground mt-2">{hint}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Button */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          <BookOpen className="h-4 w-4" />
          Optimal Approach
        </Button>

        {/* Explanation */}
        {showExplanation && (
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 space-y-2">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {explanation}
            </p>
          </div>
        )}

        <Badge variant="secondary" className="text-xs">
          💡 Use hints to learn, not just solve
        </Badge>
      </CardContent>
    </Card>
  );
}

import { BookOpen } from 'lucide-react';
