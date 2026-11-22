import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, "server/api-entry.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    outDir: "api",
    emptyOutDir: false,
    target: "node20",
    ssr: true,
    rollupOptions: {
      external: [
        "fs", "path", "url", "http", "https", "os", "crypto", "stream", "util", "events", "buffer", "querystring", "child_process",
        "express", "cors", "helmet", "express-rate-limit", "pg", "bcryptjs", "jsonwebtoken", "multer", "zod", "dotenv"
      ],
      output: {
        format: "es",
        entryFileNames: "index.js",
      },
    },
    minify: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
