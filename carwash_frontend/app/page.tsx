'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Car, DollarSign, Clock, Users } from 'lucide-react';
import { ThemedButton } from '@/components/ui/themed-button';
import { getAccessToken } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-teal-50 px-4 py-24 sm:px-6 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Wrench size={32} className="text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Car Wash Management System
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
              The complete solution for managing your car wash business efficiently
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <ThemedButton 
                size="lg"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </ThemedButton>
              <ThemedButton 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/auth/register')}
              >
                Create Account
              </ThemedButton>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Streamline Your Car Wash Operations</h2>
            <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive system helps you manage every aspect of your car wash business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Car size={28} className="text-primary" />
                </div>
                <h3 className="card-title justify-center">Vehicle Management</h3>
                <p className="text-muted-foreground">
                  Easily track customer vehicles with complete service history
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock size={28} className="text-primary" />
                </div>
                <h3 className="card-title justify-center">Scheduling</h3>
                <p className="text-muted-foreground">
                  Manage appointments and optimize your service capacity
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users size={28} className="text-primary" />
                </div>
                <h3 className="card-title justify-center">Staff Management</h3>
                <p className="text-muted-foreground">
                  Assign tasks to workers and track performance metrics
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <DollarSign size={28} className="text-primary" />
                </div>
                <h3 className="card-title justify-center">Payment Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor transactions and generate financial reports
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Ready to streamline your car wash business?</h2>
          <p className="mt-4 max-w-2xl mx-auto">
            Join thousands of car wash businesses that trust our system for their daily operations.
          </p>
          <div className="mt-10">
            <ThemedButton 
              size="lg" 
              variant="secondary"
              onClick={() => router.push('/auth/register')}
            >
              Get Started Today
            </ThemedButton>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-border pt-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                <Wrench size={20} className="text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Car Wash Pro</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Car Wash Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}