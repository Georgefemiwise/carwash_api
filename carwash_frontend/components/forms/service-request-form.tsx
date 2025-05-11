"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceRequest, Car } from "@/types";
import { ThemedInput } from "@/components/ui/themed-input";
import { ThemedSelect } from "@/components/ui/themed-select";
import { ThemedButton } from "@/components/ui/themed-button";
import { useCars } from "@/hooks/use-cars";
import { useServiceTypes } from "@/hooks/use-services";
import { useServiceRequestMutations } from "@/hooks/use-services";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Date helper function
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(9, 0, 0, 0);

// Service request form schema
const serviceRequestSchema = z.object({
  car: z.string().min(1, "Car is required"),
  serviceTypeId: z.string().min(1, "Service type is required"),
  scheduledAt: z.string().min(1, "Scheduled date is required"),
  description: z.string().optional(),
});

type ServiceRequestFormValues = z.infer<typeof serviceRequestSchema>;

interface ServiceRequestFormProps {
  serviceRequest?: ServiceRequest;
  customerId?: string;
  onSuccess?: () => void;
}

export function ServiceRequestForm({
  serviceRequest,
  customerId,
  onSuccess,
}: ServiceRequestFormProps) {
  const { serviceTypes } = useServiceTypes();
  const { cars } = useCars(customerId);
  const { createServiceRequest, updateServiceRequest } =
    useServiceRequestMutations();

  const isEditing = !!serviceRequest;

  // Format the default scheduled date if editing
  const formattedScheduledAt = serviceRequest
    ? format(new Date(serviceRequest.scheduledAt), "yyyy-MM-dd'T'HH:mm")
    : format(tomorrow, "yyyy-MM-dd'T'HH:mm");

  const defaultValues: Partial<ServiceRequestFormValues> = {
    car: serviceRequest?.carId || "",
    serviceTypeId: serviceRequest?.serviceTypeId || "",
    scheduledAt: formattedScheduledAt,
    description:  serviceRequest?.description || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues,
  });

  useEffect(() => {
    // Set car ID if only one car is available and no car is selected
    if (cars.length === 1 && !defaultValues.car) {
      setValue("car", cars[0].id);
    }
  }, [cars, defaultValues.car, setValue]);

  const onSubmit = async (data: ServiceRequestFormValues) => {
    try {
      if (isEditing && serviceRequest) {
        await updateServiceRequest.mutateAsync({
          id: serviceRequest.id,
          data: {
            id: data.serviceTypeId,
            scheduledAt: data.scheduledAt,
            description: data.description,
          },
        });
      } else {
        await createServiceRequest.mutateAsync(data);
        reset(); // Clear form after successful creation
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting service request form:", error);
    }
  };

  // Transform cars to option format
  const carOptions = cars.map((car) => ({
    value: car.id,
    label: `${car.make} ${car.model} (${car.license_plate})`,
  }));

  // Transform service types to option format
  const serviceTypeOptions = serviceTypes.map((type) => ({
    value: type.id,
    label: `${type.name} - $${type.price}`,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 animate-fade-in"
    >
      <ThemedSelect
        label="Car"
        options={carOptions}
        placeholder="Select a car"
        {...register("car")}
        error={errors.car?.message}
        disabled={isEditing || carOptions.length === 0}
      />

      {carOptions.length === 0 && (
        <div className="text-sm text-warning">
          You need to add a car before you can request a service.
        </div>
      )}

      <ThemedSelect
        label="Service Type"
        options={serviceTypeOptions}
        placeholder="Select a service type"
        {...register("serviceTypeId")}
        error={errors.serviceTypeId?.message}
      />

      <ThemedInput
        label="Scheduled Date & Time"
        type="datetime-local"
        min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
        icon={<CalendarIcon size={16} />}
        {...register("scheduledAt")}
        error={errors.scheduledAt?.message}
      />

      <div className="form-control">
        <label className="label">
          <span className="label-text">Notes (Optional)</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Any special requirements or information..."
          {...register("description")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <ThemedButton type="button" variant="outline" onClick={() => reset()}>
          Cancel
        </ThemedButton>
        <ThemedButton
          type="submit"
          isLoading={isSubmitting}
          disabled={carOptions.length === 0}
        >
          {isEditing ? "Update Request" : "Submit Request"}
        </ThemedButton>
      </div>
    </form>
  );
}
