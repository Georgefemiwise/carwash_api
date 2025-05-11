'use client';

import React from 'react';
import { ThemedButton } from '@/components/ui/themed-button';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline';
    icon?: React.ReactNode;
  }[];
  backButton?: boolean;
}

export function PageHeader({ 
  title, 
  description, 
  actions = [],
  backButton = false
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          {backButton && (
            <ThemedButton
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-2"
            >
              ← Back
            </ThemedButton>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <ThemedButton
              key={index}
              variant={action.variant || 'default'}
              onClick={action.onClick}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </ThemedButton>
          ))}
        </div>
      )}
    </div>
  );
}