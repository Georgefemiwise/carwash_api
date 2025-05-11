"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThemedInput } from "@/components/ui/themed-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { getAccessToken, getRefreshToken, useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone } from "lucide-react";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register schema
const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirm: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const { login, register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirm: "",
    },
  });

  const currentForm = mode === "login" ? loginForm : registerForm;

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setError(null);
    try {
      if (mode === "login") {
        const user = await login(data as LoginFormValues);
        if (user) {
          router.replace("/dashboard");
        } else {
          setError("Invalid email or password");
        }
      } else {
        const user = await registerUser(data as RegisterFormValues);
        if (user) {
          router.push("/dashboard");
        } else {
          setError("Registration failed. Email might be in use.");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("An unexpected error occurred");
    }
  };


  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg border border-border animate-slide-in">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>

      {error && (
        <div className="alert alert-error mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-4">
        {mode === "register" && (
          <ThemedInput
            label="Full Name"
            placeholder="John Doe"
            icon={<User size={16} className="text-muted-foreground" />}
            {...registerForm.register("full_name")}
            error={registerForm.formState.errors.full_name?.message}
          />
        )}

        <ThemedInput
          label="Email Address"
          placeholder="email@example.com"
          icon={<Mail size={16} className="text-muted-foreground" />}
          {...currentForm.register("email")}
          error={currentForm.formState.errors.email?.message}
        />

        {mode === "register" && (
          <ThemedInput
            label="Phone Number (Optional)"
            placeholder="+1 234 567 8900"
            icon={<Phone size={16} className="text-muted-foreground" />}
            {...registerForm.register("phone")}
            error={registerForm.formState.errors.phone?.message}
          />
        )}
        <ThemedInput
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={16} className="text-muted-foreground" />}
          {...currentForm.register("password")}
          error={currentForm.formState.errors.password?.message}
        />
        {mode === "register" && (
          <ThemedInput
            label="Password_confirm"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={16} className="text-muted-foreground" />}
            {...registerForm.register("password_confirm")}
            error={registerForm.formState.errors.password?.message}
          />
        )}

        <ThemedButton
          type="submit"
          className="w-full mt-2"
          isLoading={currentForm.formState.isSubmitting}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </ThemedButton>
      </form>
    </div>
  );
}
