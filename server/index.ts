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

  // Middleware Security & CORS
  app.use(
    helmet({
      contentSecurityPolicy: false, // Menghindari isu blokir gambar dari unspash/cdn
    })
  );
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
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
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      message: "Terjadi kesalahan internal pada server",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  return app;
}
