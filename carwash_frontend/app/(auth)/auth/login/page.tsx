'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/forms/auth-form';
import { Wrench } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Wrench size={24} className="text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Car Wash Pro</h1>
        <p className="text-muted-foreground mb-8">
          Sign in to access your car wash management dashboard
        </p>
      </div>
      
      <AuthForm mode="login" />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link 
          href="/auth/register" 
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}