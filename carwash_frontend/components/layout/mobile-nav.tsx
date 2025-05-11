'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './sidebar';
import { ThemedButton } from '@/components/ui/themed-button';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <>
      <ThemedButton 
        variant="ghost" 
        onClick={toggleOpen}
        className="md:hidden p-0 w-10 h-10 rounded-full"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </ThemedButton>

      {/* Mobile nav overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      {/* Mobile nav sidebar */}
      <div 
        className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-background md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <ThemedButton 
            variant="ghost" 
            onClick={close}
            className="p-0 w-8 h-8 rounded-full"
            aria-label="Close menu"
          >
            <X size={24} />
          </ThemedButton>
        </div>
        <div className="h-full pt-12">
          <Sidebar closeMobile={close} />
        </div>
      </div>
    </>
  );
}