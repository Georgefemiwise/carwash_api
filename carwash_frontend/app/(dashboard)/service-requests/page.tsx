"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ThemedButton } from "@/components/ui/themed-button";
import { ServiceCard } from "@/components/cards/service-card";
import {
  useServiceRequests,
  useServiceRequestMutations,
  useServiceTypes, // ✅ Import useServiceTypes
} from "@/hooks/use-services";
import { useCurrentUser } from "@/hooks/use-user";
import { ServiceStatus, UserRole } from "@/types";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemedSelect, SelectOption } from "@/components/ui/themed-select";

export default function ServiceRequestsPage() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");

  // ✅ Get service types for potential use (e.g., in filters or form options)
  const { serviceTypes, isLoading: loadingServiceTypes } = useServiceTypes();

  // Build filter object based on user role and selected status
  const filters = {
    ...(currentUser?.role === UserRole.CUSTOMER
      ? { customerId: currentUser.id }
      : {}),
    ...(currentUser?.role === UserRole.STAFF
      ? { workerId: currentUser.id }
      : {}),
    ...(statusFilter ? { status: statusFilter as ServiceStatus } : {}),
  };

  const { serviceRequests, isLoading } = useServiceRequests(filters);
  const { updateServiceRequest } = useServiceRequestMutations();

  // Status options for filtering
  const statusOptions: SelectOption[] = [
    { value: "", label: "All Statuses" },
    { value: ServiceStatus.PENDING, label: "Pending" },
    { value: ServiceStatus.IN_PROGRESS, label: "In Progress" },
    { value: ServiceStatus.COMPLETED, label: "Completed" },
    { value: ServiceStatus.CANCELLED, label: "Cancelled" },
  ];

  // Navigation to new request page
  const handleAddRequest = () => {
    router.push("/service-requests/new");
  };

  // Update filter state
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Update service request status
  const handleUpdateStatus = async (id: string, status: ServiceStatus) => {
    try {
      await updateServiceRequest.mutateAsync({
        id,
        data: { status },
      });
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  // Navigate to service detail page
  const viewServiceDetails = (id: string) => {
    router.push(`/service-requests/${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Requests"
        description="Manage all your service requests"
        actions={[
          {
            label: "New Request",
            onClick: handleAddRequest,
            icon: <Plus size={16} />,
          },
        ]}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Status Filter Dropdown */}
        <div className="w-full sm:w-64">
          <ThemedSelect
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {serviceRequests.length} service request(s)
        </div>
      </div>

      {/* ✅ Optional: List available service types */}
      {!loadingServiceTypes && serviceTypes.length > 0 && (
        <div className="p-4 bg-muted/10 rounded-lg border border-border">
          <h2 className="font-medium mb-2">Available Service Types:</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {serviceTypes.map((type) => (
              <li key={type.id}>{type.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Requests section */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-lg bg-muted/40 animate-pulse"
            ></div>
          ))}
        </div>
      ) : serviceRequests.length > 0 ? (
        <div className="space-y-4">
          {serviceRequests.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewDetails={viewServiceDetails}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-border">
          {/* No Requests UI */}
          <svg
            className="w-12 h-12 mx-auto text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium">
            No service requests found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            {statusFilter
              ? "No service requests match your filter."
              : "You have no active service requests."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {statusFilter && (
              <ThemedButton
                variant="outline"
                onClick={() => setStatusFilter("")}
              >
                <RefreshCw size={16} className="mr-2" />
                Clear Filter
              </ThemedButton>
            )}
            <ThemedButton onClick={handleAddRequest}>
              <Plus size={16} className="mr-2" />
              Create New Request
            </ThemedButton>
          </div>
        </div>
      )}
    </div>
  );
}
