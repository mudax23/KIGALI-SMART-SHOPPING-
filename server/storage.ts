import { 
  products, statsUsers,
  type Product, type InsertProduct, type UpdateProductRequest,
  type StatsUser, type InsertStatsUser, type DashboardStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(category?: string, search?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: UpdateProductRequest): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  incrementProductView(id: number): Promise<void>;

  // Stats Users
  createStatsUser(user: InsertStatsUser): Promise<StatsUser>;
  getStatsUsersCount(): Promise<number>;

  // Dashboard Stats
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (category) {
      query = query.where(eq(products.category, category));
    }
    
    // Simple search implementation could go here if needed, 
    // but Drizzle query builder structure makes conditional 'where' a bit verbose 
    // without query builder helper. For now, category filter is primary.
    // If search is needed, we'd need ilike.
    
    return await query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: UpdateProductRequest): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async incrementProductView(id: number): Promise<void> {
    await db
      .update(products)
      .set({ viewCount: sql`${products.viewCount} + 1` })
      .where(eq(products.id, id));
  }

  async createStatsUser(insertUser: InsertStatsUser): Promise<StatsUser> {
    const [user] = await db.insert(statsUsers).values(insertUser).returning();
    return user;
  }

  async getStatsUsersCount(): Promise<number> {
    const count = await db.select({ count: sql<number>`count(*)` }).from(statsUsers);
    return Number(count[0]?.count || 0);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(statsUsers);
    const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    
    const mostViewed = await db.select()
      .from(products)
      .orderBy(desc(products.viewCount))
      .limit(5);

    return {
      totalUsers: Number(userCount?.count || 0),
      totalProducts: Number(productCount?.count || 0),
      mostViewedProducts: mostViewed,
    };
  }
}

export const storage = new DatabaseStorage();
