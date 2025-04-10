import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import linkRoutes from "./routes/link.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import connectDB from "./db/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.send("Welcome to the URL Shortener API!");
}
);
app.use("/", linkRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
