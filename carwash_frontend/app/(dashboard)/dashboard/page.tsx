'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/cards/stat-card';
import { ServiceCard } from '@/components/cards/service-card';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { format } from 'date-fns';
import { useServiceRequestMutations } from '@/hooks/use-services';
import { ServiceStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { 
  RefreshCw, 
  Car, 
  Users, 
  Wrench, 
  DollarSign, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { ThemedButton } from '@/components/ui/themed-button';

export default function DashboardPage() {
  const router = useRouter();
  const { stats, isLoading } = useDashboardStats();
  const { updateServiceRequest } = useServiceRequestMutations();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleUpdateStatus = async (id: string, status: ServiceStatus) => {
    try {
      await updateServiceRequest.mutateAsync({
        id,
        data: { status }
      });
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const viewServiceDetails = (id: string) => {
    router.push(`/service-requests/${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your car wash business"
        actions={[
          {
            label: 'Refresh',
            onClick: handleRefresh,
            variant: 'outline',
            icon: <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />,
          },
        ]}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted/40 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Cars" 
            value={stats?.totalCars || 0}
            icon={<Car size={20} className="text-primary" />}
          />
          <StatCard 
            title="Total Customers" 
            value={stats?.totalCustomers || 0}
            icon={<Users size={20} className="text-primary" />}
          />
          <StatCard 
            title="Services Today" 
            value={stats?.pendingServices || 0}
            icon={<Wrench size={20} className="text-primary" />}
          />
          <StatCard 
            title="Revenue" 
            value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
            trend={{ value: 12, isPositive: true }}
            icon={<DollarSign size={20} className="text-primary" />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Upcoming Services</h2>
            <ThemedButton 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/service-requests')}
            >
              View all <ArrowUpRight size={14} className="ml-1" />
            </ThemedButton>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 rounded-lg bg-muted/40 animate-pulse"></div>
              ))}
            </div>
          ) : stats?.upcomingServices && stats.upcomingServices.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onViewDetails={viewServiceDetails}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-border">
              <Clock size={48} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No upcoming services</h3>
              <p className="text-muted-foreground">
                When you have upcoming services, they will appear here.
              </p>
              <ThemedButton
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/service-requests/new')}
              >
                Create a new service request
              </ThemedButton>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-muted/40 animate-pulse"></div>
              ))}
            </div>
          ) : stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {stats.recentTransactions.map((transaction) => (
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
              <div className="p-4 border-t border-border bg-muted/10">
                <ThemedButton 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => router.push('/transactions')}
                >
                  View all transactions
                </ThemedButton>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-lg border border-border">
              <DollarSign size={32} className="mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No transactions</h3>
              <p className="text-sm text-muted-foreground">
                Recent transactions will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}