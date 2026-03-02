'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Code2,
  Flame,
  Trophy,
  MessageSquare,
  Settings,
  Bookmark,
  Plus,
  MessageCircle,
  BarChart3,
  Layers,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Problems',
    href: '/problems',
    icon: Code2,
  },
  {
    label: 'Topics',
    href: '/topics',
    icon: Layers,
  },
  {
    label: 'Bookmarks',
    href: '/bookmarks',
    icon: Bookmark,
  },
  {
    label: 'Daily Challenge',
    href: '/daily-challenge',
    icon: Flame,
  },
  {
    label: 'Achievements',
    href: '/achievements',
    icon: Trophy,
  },
  {
    label: 'Discussions',
    href: '/problems/1/discussions',
    icon: MessageSquare,
  },
  {
    label: 'Feedback',
    href: '/feedback',
    icon: MessageCircle,
  },
];

const adminItems = [
  {
    label: 'Admin Panel',
    href: '/admin',
    icon: BarChart3,
  },
  {
    label: 'Add Question',
    href: '/questions/add',
    icon: Plus,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-secondary/30 dark:bg-secondary/10">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase px-2">Admin</p>
          {adminItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
