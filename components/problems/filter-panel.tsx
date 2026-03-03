'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import type { Difficulty } from '../../lib/types/problem';

type FilterPanelProps = {
  search: string;
  onSearchChange: (value: string) => void;
  difficulties: Difficulty[];
  onDifficultiesChange: (difficulties: Difficulty[]) => void;
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
};

const allDifficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const allCategories = [
  'Array',
  'Hash Table',
  'String',
  'Linked List',
  'Binary Search',
  'Sliding Window',
  'Stack',
  'Queue',
  'Tree',
  'Graph',
  'Dynamic Programming',
  'Math',
];

export function FilterPanel({
  search,
  onSearchChange,
  difficulties,
  onDifficultiesChange,
  categories,
  onCategoriesChange,
}: FilterPanelProps) {
  const toggleDifficulty = (difficulty: Difficulty) => {
    if (difficulties.includes(difficulty)) {
      onDifficultiesChange(difficulties.filter((d) => d !== difficulty));
    } else {
      onDifficultiesChange([...difficulties, difficulty]);
    }
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      onCategoriesChange(categories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...categories, category]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Difficulty */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {allDifficulties.map((difficulty) => (
            <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={difficulties.includes(difficulty)}
                onChange={() => toggleDifficulty(difficulty)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{difficulty}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {allCategories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{category}</span>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
