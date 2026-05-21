import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  // Dokploy will inject its own environment variables, but we default to 3000
  const PORT = process.env.PORT || 3000;

  // Add your API routes here BEFORE the Vite middleware
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve the React application
  if (process.env.NODE_ENV !== "production") {
    // Development mode: use Vite middleware for Hot Module Replacement
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve static files compiled in the /dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
