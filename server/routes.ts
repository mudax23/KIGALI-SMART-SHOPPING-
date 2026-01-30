import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // === Public Routes ===

  // List Products
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const products = await storage.getProducts(category, search);
    res.json(products);
  });

  // Get Product
  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Increment view count
    await storage.incrementProductView(product.id);
    res.json(product);
  });

  // Create Stats User (Signup)
  app.post(api.statsUsers.create.path, async (req, res) => {
    try {
      const input = api.statsUsers.create.input.parse(req.body);
      const user = await storage.createStatsUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      // Handle unique constraint error
      if (err instanceof Error && err.message.includes("unique")) {
         return res.status(400).json({ message: "Email already registered" });
      }
      throw err;
    }
  });

  // === Protected Routes (Admin) ===

  // Create Product
  app.post(api.products.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Increment view (manually if needed, but done in get)
  app.post(api.products.incrementView.path, async (req, res) => {
    await storage.incrementProductView(Number(req.params.id));
    res.status(200).send();
  });

  // Admin Stats
  app.get(api.admin.stats.path, isAuthenticated, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Delete Product
  app.delete(api.products.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(200).send();
  });

  // Seed Data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const seedProducts = [
      {
        name: "Wireless Headphones",
        description: "High quality wireless headphones with noise cancellation.",
        price: 99.99,
        category: "Tech",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        viewCount: 120
      },
      {
        name: "Smart Watch Series 5",
        description: "Track your fitness and stay connected.",
        price: 199.50,
        category: "Tech",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        viewCount: 45
      },
      {
        name: "Precision Screwdriver Set",
        description: "64-piece screwdriver set for electronics repair.",
        price: 29.99,
        category: "Repair Tools",
        imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&q=80",
        viewCount: 80
      },
      {
        name: "Soldering Iron Kit",
        description: "Adjustable temperature soldering iron with stand.",
        price: 45.00,
        category: "Repair Tools",
        imageUrl: "https://images.unsplash.com/photo-1593106197126-5b432e3c023d?w=600&q=80",
        viewCount: 30
      },
      {
        name: "Laptop Stand",
        description: "Ergonomic aluminum laptop stand.",
        price: 35.99,
        category: "Accessories",
        imageUrl: "https://images.unsplash.com/photo-1616423664074-907f885304e2?w=600&q=80",
        viewCount: 65
      }
    ];

    for (const p of seedProducts) {
      await storage.createProduct(p);
    }
  }
}
