import { z } from 'zod';
import { insertProductSchema, insertStatsUserSchema, products, statsUsers } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products',
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }), // Unauthorized
      },
    },
    incrementView: {
      method: 'POST' as const,
      path: '/api/products/:id/view',
      responses: {
        200: z.void(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id',
      responses: {
        200: z.void(),
        404: errorSchemas.notFound,
        401: z.object({ message: z.string() }),
      },
    },
  },
  statsUsers: {
    create: {
      method: 'POST' as const,
      path: '/api/stats-users',
      input: insertStatsUserSchema,
      responses: {
        201: z.custom<typeof statsUsers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  admin: {
    stats: {
      method: 'GET' as const,
      path: '/api/admin/stats',
      responses: {
        200: z.object({
          totalProducts: z.number(),
          totalUsers: z.number(),
          mostViewedProducts: z.array(z.custom<typeof products.$inferSelect>()),
        }),
        401: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProductInput = z.infer<typeof api.products.create.input>;
export type ProductResponse = z.infer<typeof api.products.get.responses[200]>;
export type DashboardStatsResponse = z.infer<typeof api.admin.stats.responses[200]>;
