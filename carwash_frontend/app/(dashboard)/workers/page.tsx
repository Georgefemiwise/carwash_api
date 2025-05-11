'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useUsers } from '@/hooks/use-user';
import { UserRole } from '@/types';
import { Users } from 'lucide-react';

export default function WorkersPage() {
  const { users: workers, isLoading } = useUsers(UserRole.STAFF);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Workers" 
        description="Manage your staff members"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-muted/40 animate-pulse"></div>
          ))}
        </div>
      ) : workers && workers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <div key={worker.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-border">
              <div className="card-body">
                <h3 className="card-title">{worker.full_name}</h3>
                <p className="text-sm text-muted-foreground">{worker.email}</p>
                {worker.phone && (
                  <p className="text-sm">{worker.phone}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-border">
          <Users size={48} className="mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No workers found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            Staff members will appear here once they are added to the system.
          </p>
        </div>
      )}
    </div>
  );
}