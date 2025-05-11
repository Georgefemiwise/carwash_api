"use client";

import { Car } from "@/types";
import { Edit, EyeIcon, Trash2 } from "lucide-react";
import { ThemedButton } from "@/components/ui/themed-button";
import Link from "next/link";

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

export function CarCard({ car, onEdit, onDelete }: CarCardProps) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-border">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3 className="card-title">
            {car.make} {car.model}
          </h3>
          <div className="badge badge-primary">{car.year}</div>
        </div>

        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-muted shadow"
              style={{ backgroundColor: car.color }}
            ></div>
            <span className="text-muted-foreground capitalize">
              {car.color}
            </span>
          </div>

          <p className="font-medium">
            License: <span className="font-normal">{car.license_plate}</span>
          </p>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link href={`cars/${car.id}`}>
            <ThemedButton
              variant="outline"
              size="sm"
            >
              <EyeIcon size={16} className="mr-1" />
              view
            </ThemedButton>
          </Link>
          <ThemedButton variant="outline" size="sm" onClick={() => onEdit(car)}>
            <Edit size={16} className="mr-1" />
            Edit
          </ThemedButton>
          <ThemedButton
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(car)}
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </ThemedButton>
        </div>
      </div>
    </div>
  );
}
