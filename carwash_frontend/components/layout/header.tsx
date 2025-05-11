'use client';

import { Bell } from 'lucide-react';
import { MobileNav } from './mobile-nav';
import { UserNav } from './user-nav';
import { ThemedButton } from '@/components/ui/themed-button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="md:hidden mr-2">
          <MobileNav />
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <ThemedButton variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0">
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
          </ThemedButton>
          
          <UserNav />
        </div>
      </div>
    </header>
  );
}