import { useRouter } from "next/navigation";
import { useCallback } from "react";
import apiClient from "./axios";
import Cookies from "js-cookie";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";

// Set token expiration time (e.g., 24 hours)
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // milliseconds

export const setAuthToken = (access: string, refresh: string, user?: any) => {
  const expires = new Date(new Date().getTime() + TOKEN_EXPIRATION);
  console.log(access, refresh, user);

  // Store both tokens as cookies (or just access if needed)
  Cookies.set("access-token", access, {
    expires: 1,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  Cookies.set("refresh-token", refresh, {
    expires,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const getAccessToken = () => {
  return Cookies.get("access-token");
};

export const getRefreshToken = () => {
  return Cookies.get("refresh-token");
};

export const removeAuthTokens = () => {
  Cookies.remove("access-token");
  Cookies.remove("refresh-token");
};

export const useAuth = () => {
  const router = useRouter();

  // Login function
  const login = useCallback(
    async (credentials: LoginRequest): Promise<User | null> => {
      try {
        const response = await apiClient.post<AuthResponse>(
          "/auth/login",
          credentials
        );
        const { access, refresh, user } = response.data;

        setAuthToken(access, refresh);
        return user;
      } catch (error) {
        console.error("Login error:", error);
        return null;
      }
    },
    []
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterRequest): Promise<User | null> => {
      try {
        const response = await apiClient.post<AuthResponse>(
          "/auth/register",
          userData
        );
        const { access, refresh, user } = response.data;

        setAuthToken(access, refresh); // store both tokens
        return user;
      } catch (error) {
        console.error("Registration error:", error);
        return null;
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(() => {
    removeAuthTokens();
    router.push("/auth/login");
  }, [router]);

  // Get current user
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }, []);

  return {
    login,
    register,
    logout,
    getCurrentUser,
  };
};
