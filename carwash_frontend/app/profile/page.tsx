'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useUser } from '@/hooks/use-user';
import { ThemedInput } from '@/components/ui/themed-input';
import { ThemedButton } from '@/components/ui/themed-button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { currentUser, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: currentUser?.full_name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateUser.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Profile" 
        description="View and manage your profile information"
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-card p-6 rounded-lg border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ThemedInput
              label="Full Name"
              icon={<User size={16} className="text-muted-foreground" />}
              {...register('full_name')}
              error={errors.full_name?.message}
              disabled={!isEditing}
            />
            
            <ThemedInput
              label="Email Address"
              icon={<Mail size={16} className="text-muted-foreground" />}
              {...register('email')}
              error={errors.email?.message}
              disabled={true} // Email should not be editable
            />
            
            <ThemedInput
              label="Phone Number"
              icon={<Phone size={16} className="text-muted-foreground" />}
              {...register('phone')}
              error={errors.phone?.message}
              disabled={!isEditing}
            />

            <div className="flex justify-end gap-3 pt-4">
              {isEditing ? (
                <>
                  <ThemedButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                  >
                    Cancel
                  </ThemedButton>
                  <ThemedButton
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Save Changes
                  </ThemedButton>
                </>
              ) : (
                <ThemedButton
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </ThemedButton>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}