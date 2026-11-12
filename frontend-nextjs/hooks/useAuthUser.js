"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "@/lib/api";

export function useAuthUser() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user: data?.user,
    isLoading,
    error,
    isError,
    isAuthenticated: !!data?.user,
  };
}
