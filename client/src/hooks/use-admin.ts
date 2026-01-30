import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useAuth } from "./use-auth";

export function useAdminStats() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: [api.admin.stats.path],
    enabled: !!isAuthenticated,
    queryFn: async () => {
      const res = await fetch(api.admin.stats.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return api.admin.stats.responses[200].parse(await res.json());
    },
  });
}
