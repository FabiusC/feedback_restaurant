import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import feedbackRoutes from "./routes/feedbackRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import DatabaseConnection from "./data/database/connection";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/", feedbackRoutes);
app.use("/", analyticsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Feedback API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      reviews: "/reviews",
      employees: "/employees",
      analytics: "/employees/:id/stats",
    },
    documentation: {
      reviews: {
        "POST /reviews": "Submit a new review",
        "GET /reviews/public": "Get public reviews",
      },
      employees: {
        "GET /employees": "Get all active employees",
        "GET /employees/:id/stats": "Get employee statistics",
      },
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    error: `The route ${req.originalUrl} does not exist`,
  });
});

// Error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An unexpected error occurred",
    });
  }
);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection and tables
    const db = DatabaseConnection.getInstance();
    await db.initializeTables();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  const db = DatabaseConnection.getInstance();
  await db.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  const db = DatabaseConnection.getInstance();
  await db.close();
  process.exit(0);
});

// Start the server
startServer();
