'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Calendar, CheckSquare, MapPin, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/expenses/settlements', label: 'Settlements', icon: Wallet },
  { href: '/expenses/analytics', label: 'Analytics', icon: Wallet },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/todo', label: 'To-Do', icon: CheckSquare },
  { href: '/places', label: 'Places', icon: MapPin },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen fixed left-0 top-0">
      <div className="p-6 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          🇰🇷 Korea Hub
        </h1>
        <ThemeToggle />
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
