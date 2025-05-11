"use client";

import { useCar } from "@/hooks/use-cars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CarDetailPage({ id }:{  id: string } ) {
  const { car, isLoading, error } = useCar(id);
  
  const router = useRouter();

  if (isLoading) {
    return <Skeleton className="w-full h-48 rounded-xl mt-10" />;
  }

  if (error || !car) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center text-red-500">
        Car not found or failed to load.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6 px-4">
      {/* Return Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      {/* Car Overview */}
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex justify-between items-center">
            {car.make} {car.model}
            <Badge variant="outline">{car.year}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <Detail label="License Plate" value={car.license_plate} />
            <Detail label="Color">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border shadow"
                  style={{ backgroundColor: car.color }}
                />
                <span className="capitalize">{car.color}</span>
              </div>
            </Detail>
            <Detail label="Make" value={car.make} />
            <Detail label="Model" value={car.model} />
            <Detail label="Year" value={car.year} />
          </div>
        </CardContent>
      </Card>

      {/* Owner Info */}
      <Card className="border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Owner Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {car.owner ? (
            <>
              <Detail label="Owner ID" value={car.ownerId} />
              <Detail label="Name" value={car.owner.full_name} />
              <Detail label="Email" value={car.owner.email} />
            </>
          ) : (
            <p>Owner details not available.</p>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Timestamps</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <Detail
            label="Created At"
            value={new Date(car.createdAt).toLocaleString()}
          />
          <Detail
            label="Updated At"
            value={new Date(car.updatedAt).toLocaleString()}
          />
          <Detail label="Car ID" value={car.id} />
        </CardContent>
      </Card>
    </div>
  );
}

// Detail component for reuse
function Detail({
  label,
  value,
  children,
}: {
  label: string;
  value?: any;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-foreground">{label}</span>
      {children ?? <span>{value}</span>}
    </div>
  );
}
