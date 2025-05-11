"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ThemedButton } from "@/components/ui/themed-button";
import { useForm } from "react-hook-form";
import { Car, CarCreateRequest, User } from "@/types";
import { useCarMutations } from "@/hooks/use-cars";

type CarFormProps = {
  car?: Car;
  onSuccess: () => void;
};

export function CarForm({ car, onSuccess }: CarFormProps) {
  const isEditing = !!car;

  const form = useForm<CarCreateRequest>({
    defaultValues: {
      make: car?.make || "",
      model: car?.model || "",
      year: car?.year || new Date().getFullYear(),
      color: car?.color || "",
      license_plate: car?.license_plate || "",
    },
  });

  const { createCar, updateCar } = useCarMutations();
  // Update owner if user changes

  const onSubmit = async (data: CarCreateRequest) => {
    try {
      if (isEditing && car) {
        await updateCar.mutateAsync({ id: car.id, data });
      } else {
        await createCar.mutateAsync(data);
        form.reset(); // Clear form
      }

      onSuccess();
    } catch (err) {
      console.error("Car form error:", err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...form.register("owner")} />
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Toyota" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Corolla" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 2020" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input
                  type="color"
                  {...field}
                  className="h-10 w-16 p-1 rounded border"
                  placeholder="e.g. Red"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license_plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Plate</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. AS1234-21" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ThemedButton type="submit" className="w-full">
          {car ? "Update Car" : "Add Car"}
        </ThemedButton>
      </form>
    </Form>
  );
}
