import React from "react";
import { ServiceRequest, ServiceStatus } from "@/types";
import { format } from "date-fns";
import { Wrench, Calendar, CarFront, User } from "lucide-react";
import { ThemedButton } from "@/components/ui/themed-button";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceRequest;
  onViewDetails?: (id: string) => void;
  onUpdateStatus?: (id: string, status: ServiceStatus) => void;
}

export function ServiceCard({
  service,
  onViewDetails,
  onUpdateStatus,
}: ServiceCardProps) {
  const statusColors = {
    [ServiceStatus.PENDING]: "bg-warning/20 text-warning border-warning/30",
    [ServiceStatus.IN_PROGRESS]: "bg-info/20 text-info border-info/30",
    [ServiceStatus.COMPLETED]: "bg-success/20 text-success border-success/30",
    [ServiceStatus.CANCELLED]:
      "bg-destructive/20 text-destructive border-destructive/30",
  };

  const statusText = {
    [ServiceStatus.PENDING]: "Pending",
    [ServiceStatus.IN_PROGRESS]: "In Progress",
    [ServiceStatus.COMPLETED]: "Completed",
    [ServiceStatus.CANCELLED]: "Cancelled",
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-border">
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-lg">
            {service.serviceType?.name || "Service"}
          </h3>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border",
              statusColors[service.status]
            )}
          >
            {statusText[service.status]}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(service.scheduledAt), "PPP p")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CarFront size={16} className="text-muted-foreground" />
            <span className="text-sm">
              {service.car?.make} {service.car?.model} (
              {service.car?.license_plate})
            </span>
          </div>

          {service.assignedWorker && (
            <div className="flex items-center gap-2">
              <User size={16} className="text-muted-foreground" />
              <span className="text-sm">
                Assigned to: {service.assignedWorker.name}
              </span>
            </div>
          )}

          {service.description && (
            <div className="mt-2 p-3 bg-muted/30 rounded-md">
              <p className="text-sm">{service.description}</p>
            </div>
          )}
        </div>

        <div className="card-actions mt-4 flex justify-end gap-2">
          {onViewDetails && (
            <ThemedButton
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(service.id)}
            >
              View Details
            </ThemedButton>
          )}

          {onUpdateStatus && service.status === ServiceStatus.PENDING && (
            <ThemedButton
              variant="default"
              size="sm"
              onClick={() =>
                onUpdateStatus(service.id, ServiceStatus.IN_PROGRESS)
              }
            >
              <Wrench size={16} className="mr-1" />
              Start Service
            </ThemedButton>
          )}

          {onUpdateStatus && service.status === ServiceStatus.IN_PROGRESS && (
            <ThemedButton
              variant="default"
              size="sm"
              onClick={() =>
                onUpdateStatus(service.id, ServiceStatus.COMPLETED)
              }
            >
              Complete
            </ThemedButton>
          )}
        </div>
      </div>
    </div>
  );
}
