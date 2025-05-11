'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useUsers } from '@/hooks/use-user';
import { UserRole } from '@/types';
import { Users } from 'lucide-react';

export default function CustomersPage() {
  const { users: customers, isLoading } = useUsers(UserRole.CUSTOMER);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customers" 
        description="View and manage your customers"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-muted/40 animate-pulse"></div>
          ))}
        </div>
      ) : customers && customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <div key={customer.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-border">
              <div className="card-body">
                <h3 className="card-title">{customer.full_name}</h3>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm">{customer.phone}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-border">
          <Users size={48} className="mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No customers found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            Customer information will appear here once they register in the system.
          </p>
        </div>
      )}
    </div>
  );
}