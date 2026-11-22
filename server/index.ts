import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { authRoutes } from "./routes/auth";
import { menuRouter } from "./routes/menu";
import { categoriesRouter } from "./routes/categories";
import { ordersRouter } from "./routes/orders";
import { profileRouter } from "./routes/profile";
import { favoritesRouter } from "./routes/favorites";

export function createServer() {
  const app = express();

  // Trust reverse proxy (Vercel, render, cloudflare)
  app.set("trust proxy", 1);

  // Middleware Security & CORS
  app.use(
    helmet({
      contentSecurityPolicy: false, // Menghindari isu blokir gambar dari unsplash/cdn
    })
  );
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Normalisasi req.url jika diarahkan oleh Vercel rewrite
  app.use((req: any, _res: any, next: any) => {
    if (req.url && req.originalUrl && (req.url.startsWith('/api/index') || req.url === '/api')) {
      req.url = req.originalUrl;
    }
    next();
  });

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, default: false },
  });
  app.use(limiter);

  // Health check endpoint
  app.get("/api/health", (_req: any, res: any) => {
    res.json({
      status: "ok",
      app: "GOMeal API",
      tagline: "Good Food, Good Mood!",
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Endpoints
  app.use("/api/auth", authRoutes);
  app.use("/api/v1/menu", menuRouter);
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/orders", ordersRouter);
  app.use("/api/v1/profile", profileRouter);
  app.use("/api/v1/favorites", favoritesRouter);

  // Global Error Handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Unhandled error:", err);
    if (res && typeof res.status === "function") {
      res.status(500).json({
        message: "Terjadi kesalahan internal pada server",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  });

  return app;
}
