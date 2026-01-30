import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ProductInput } from "@shared/routes";

export function useProducts(filters?: { category?: string; search?: string }) {
  const queryKey = [api.products.list.path, filters?.category, filters?.search];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      let url = api.products.list.path;
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProductInput) => {
      const res = await fetch(api.products.create.path, {
        method: api.products.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) throw new Error("Invalid product data");
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to create product");
      }
      return api.products.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.admin.stats.path] });
    },
  });
}

export function useIncrementView() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.products.incrementView.path, { id });
      await fetch(url, {
        method: api.products.incrementView.method,
        credentials: "include",
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.products.delete.path, { id });
      const res = await fetch(url, {
        method: api.products.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to delete product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.admin.stats.path] });
    },
  });
}
