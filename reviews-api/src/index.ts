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
    message: "API de Feedback de Restaurante",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      reviews: "/reviews",
      employees: "/employees",
      analytics: "/employees/:id/stats",
    },
    documentation: {
      reviews: {
        "POST /reviews": "Enviar una nueva review",
        "GET /reviews/public": "Obtener reviews públicas",
      },
      employees: {
        "GET /employees": "Obtener todos los empleados activos",
        "GET /employees/:id/stats": "Obtener estadísticas de un empleado",
      },
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    error: `La ruta ${req.originalUrl} no existe`,
  });
});

// Error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Ocurrió un error inesperado",
    });
  }
);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection and tables
    const db = DatabaseConnection.getInstance();
    await db.initializeTables();
    console.log("✅ Database initialized successfully");

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
  console.log("🛑 SIGTERM received, shutting down gracefully");
  const db = DatabaseConnection.getInstance();
  await db.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  const db = DatabaseConnection.getInstance();
  await db.close();
  process.exit(0);
});

// Start the server
startServer();
