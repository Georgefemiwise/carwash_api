'use client';

import { PageHeader } from '@/components/layout/page-header';
import { ServiceRequestForm } from '@/components/forms/service-request-form';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';

export default function NewServiceRequestPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader 
        title="Create Service Request" 
        description="Schedule a new service for your car"
        backButton
      />
      
      <div className="bg-card p-6 rounded-lg border border-border">
        <ServiceRequestForm 
          customerId={currentUser?.id}
          onSuccess={() => router.push('/service-requests')}
        />
      </div>
    </div>
  );
}