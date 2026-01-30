import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
// Export auth models so they are included in the schema
export * from "./models/auth";

// === TABLE DEFINITIONS ===

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin/System Users for statistics (separate from Replit Auth users which are for admins)
// "User signup system... Users do NOT need to log in to buy... saved for statistics"
// We will just store them here.
export const statsUsers = pgTable("stats_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === SCHEMAS ===
export const insertProductSchema = createInsertSchema(products).omit({ 
  id: true, 
  createdAt: true, 
  viewCount: true 
}).extend({
  price: z.number().min(0, "Price must be positive"),
});

export const insertStatsUserSchema = createInsertSchema(statsUsers).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type StatsUser = typeof statsUsers.$inferSelect;
export type InsertStatsUser = z.infer<typeof insertStatsUserSchema>;

// Request types
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;

// Stats Response
export type DashboardStats = {
  totalProducts: number;
  totalUsers: number;
  mostViewedProducts: Product[];
};
