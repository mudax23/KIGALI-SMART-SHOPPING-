import { useMutation } from "@tanstack/react-query";
import { api, type InsertStatsUser } from "@shared/routes";

export function useCreateStatsUser() {
  return useMutation({
    mutationFn: async (data: InsertStatsUser) => {
      const res = await fetch(api.statsUsers.create.path, {
        method: api.statsUsers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) throw new Error("Invalid user data");
        throw new Error("Failed to sign up");
      }
      return api.statsUsers.create.responses[201].parse(await res.json());
    },
  });
}
