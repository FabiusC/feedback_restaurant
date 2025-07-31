import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController";

const router = Router();
const analyticsController = new AnalyticsController();

// GET /employees - Get all active employees
router.get(
  "/employees",
  analyticsController.getEmployees.bind(analyticsController)
);

// GET /employees/:id/stats - Get employee statistics
router.get(
  "/employees/:id/stats",
  analyticsController.getEmployeePerformance.bind(analyticsController)
);

export default router;
