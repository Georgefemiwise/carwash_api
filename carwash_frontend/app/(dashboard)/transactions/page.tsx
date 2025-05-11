'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useTransactions } from '@/hooks/use-transactions';
import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, isLoading } = useTransactions();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Transactions" 
        description="View and manage your transaction history"
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted/40 animate-pulse"></div>
          ))}
        </div>
      ) : transactions.length > 0 ? (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.serviceRequest?.serviceType?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {transaction.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-border">
          <DollarSign size={48} className="mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No transactions found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            Your transaction history will appear here once you have completed services.
          </p>
        </div>
      )}
    </div>
  );
}