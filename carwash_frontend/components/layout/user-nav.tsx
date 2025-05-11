'use client';

import { useState } from 'react';
import Link from 'next/link';
import {  useAuth } from "@/lib/auth";
import { User, Settings, LogOut } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-user';

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const { logout } = useAuth();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);



  if (!currentUser) {
    return null;
  }

  // Take first letter of name for avatar
  const initials = currentUser.full_name?.charAt(0) || "U";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 relative"
      >
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-medium text-lg">{initials}</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeDropdown} />
          <div className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg z-50 animate-fade-in border border-border">
            <div className="py-2 px-4 border-b border-border">
              <p className="text-sm font-medium">{currentUser.full_name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            <div className="py-1">
              <Link 
                href="/profile" 
                className="flex items-center px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"
                onClick={closeDropdown}
              >
                <User size={16} className="mr-2" />
                Profile
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"
                onClick={closeDropdown}
              >
                <Settings size={16} className="mr-2" />
                Settings
              </Link>
            </div>
            <div className="py-1 border-t border-border">
              <button 
                onClick={() => {
                  logout();
                  closeDropdown();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-secondary/50 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}