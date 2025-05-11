"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ThemedButton } from "@/components/ui/themed-button";
import { useCars, useCarMutations } from "@/hooks/use-cars";
import { useUser } from "@/hooks/use-user";
import { Car as CarIcon, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CarForm } from "@/components/forms/car-form";
import { Car, UserRole } from "@/types";
import { CarCard } from "@/components/cards/car-card";

export default function CarsPage() {
  const { currentUser } = useUser();
  const { cars, isLoading } = useCars(
    // Only filter by owner ID if the user is a customer
    currentUser?.role === UserRole.CUSTOMER ? currentUser?.id : undefined
  );
  

  const { deleteCar } = useCarMutations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleAddCar = () => {
    setIsAddOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsEditOpen(true);
  };

  const handleDeleteCar = (car: Car) => {
    setSelectedCar(car);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCar) {
      try {
        await deleteCar.mutateAsync(selectedCar.id);
        setIsDeleteOpen(false);
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cars"
        description="Manage your vehicle inventory"
        actions={[
          {
            label: "Add Car",
            onClick: handleAddCar,
            icon: <Plus size={16} />,
          },
        ]}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-lg bg-muted/40 animate-pulse"
            ></div>
          ))}
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car:Car) => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={handleEditCar}
              onDelete={handleDeleteCar}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-border">
          <CarIcon size={48} className="mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No cars found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            You haven't added any cars yet. Add your first car to start managing
            your vehicle inventory.
          </p>
          <ThemedButton onClick={handleAddCar} className="mt-6">
            <Plus size={16} className="mr-2" />
            Add Your First Car
          </ThemedButton>
        </div>
      )}

      {/* Add Car Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Car</DialogTitle>
          </DialogHeader>
          <CarForm onSuccess={() => setIsAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Car Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
          </DialogHeader>
          {selectedCar && (
            <CarForm car={selectedCar} onSuccess={() => setIsEditOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle size={18} />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this car?
              {selectedCar && (
                <span className="font-medium block mt-2">
                  {selectedCar.make} {selectedCar.model} (
                  {selectedCar.license_plate})
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <ThemedButton
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </ThemedButton>
            <ThemedButton
              variant="destructive"
              onClick={confirmDelete}
              isLoading={deleteCar.isPending}
            >
              Delete
            </ThemedButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
