import request from "supertest";
import express from "express";
import { AnalyticsController } from "../../controllers/AnalyticsController";
import { AnalyticsService } from "../../services/AnalyticsService";
import { EmployeeRepository } from "../../data/repositories/EmployeeRepository";
import analyticsRoutes from "../../routes/analyticsRoutes";

// Mock the services and repositories
jest.mock("../../services/AnalyticsService");
jest.mock("../../data/repositories/EmployeeRepository");

const MockedAnalyticsService = AnalyticsService as jest.MockedClass<
  typeof AnalyticsService
>;
const MockedEmployeeRepository = EmployeeRepository as jest.MockedClass<
  typeof EmployeeRepository
>;

describe("Analytics Integration Tests", () => {
  let app: express.Application;
  let mockAnalyticsService: jest.Mocked<AnalyticsService>;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock services
    mockAnalyticsService =
      new MockedAnalyticsService() as jest.Mocked<AnalyticsService>;
    mockEmployeeRepository =
      new MockedEmployeeRepository() as jest.Mocked<EmployeeRepository>;

    // Create Express app
    app = express();
    app.use(express.json());

    // Mock the services in the controller
    const analyticsController = new AnalyticsController();
    (analyticsController as any).analyticsService = mockAnalyticsService;
    (analyticsController as any).employeeRepository = mockEmployeeRepository;

    // Create custom router with mocked controller
    const router = require("express").Router();
    router.get(
      "/employees",
      analyticsController.getEmployees.bind(analyticsController)
    );
    router.get(
      "/employees/:id/performance",
      analyticsController.getEmployeePerformance.bind(analyticsController)
    );

    // Use the mocked routes
    app.use("/", router);

    // Add error handling middleware
    app.use((err: any, req: any, res: any, next: any) => {
      if (err instanceof SyntaxError && err.message.includes("JSON")) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrada requeridos",
          error: "JSON malformado",
        });
      }
      next(err);
    });

    // Add 404 handler for unsupported methods
    app.use("*", (req: any, res: any) => {
      res.status(404).json({
        success: false,
        message: "Endpoint no encontrado",
        error: "El endpoint solicitado no existe",
      });
    });
  });

  describe("GET /employees", () => {
    it("should return active employees successfully", async () => {
      // Arrange
      const mockEmployees = [
        {
          getId: () => 1,
          getName: () => "Juan Pérez",
          getEmail: () => "juan@example.com",
          getIsActive: () => true,
          getCreatedAt: () => new Date("2024-01-01"),
        },
        {
          getId: () => 2,
          getName: () => "María García",
          getEmail: () => "maria@example.com",
          getIsActive: () => true,
          getCreatedAt: () => new Date("2024-01-02"),
        },
      ];

      mockEmployeeRepository.findActiveEmployees.mockResolvedValue(
        mockEmployees as any
      );

      // Act
      const response = await request(app).get("/employees").expect(200);

      // Assert
      expect(response.body).toEqual([
        {
          idemployee: 1,
          name: "Juan Pérez",
          email: "juan@example.com",
          isactive: true,
          createdat: "2024-01-01T00:00:00.000Z",
        },
        {
          idemployee: 2,
          name: "María García",
          email: "maria@example.com",
          isactive: true,
          createdat: "2024-01-02T00:00:00.000Z",
        },
      ]);
      expect(mockEmployeeRepository.findActiveEmployees).toHaveBeenCalledTimes(
        1
      );
    });

    it("should return empty array when no active employees exist", async () => {
      // Arrange
      mockEmployeeRepository.findActiveEmployees.mockResolvedValue([]);

      // Act
      const response = await request(app).get("/employees").expect(200);

      // Assert
      expect(response.body).toEqual([]);
      expect(mockEmployeeRepository.findActiveEmployees).toHaveBeenCalledTimes(
        1
      );
    });

    it("should handle repository errors", async () => {
      // Arrange
      mockEmployeeRepository.findActiveEmployees.mockRejectedValue(
        new Error("Database connection failed")
      );

      // Act
      const response = await request(app).get("/employees").expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error interno del servidor",
        error: "Ocurrió un error al obtener los empleados",
      });
      expect(mockEmployeeRepository.findActiveEmployees).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe("GET /employees/:id/performance", () => {
    it("should return employee performance successfully", async () => {
      // Arrange
      const employeeId = 1;
      const mockStats = {
        toJSON: () => ({
          averageemployeerating: 4.0,
          averagespeedservice: 4.2,
          averagefoodsatisfaction: 4.5,
          reviewcount: 10,
        }),
      };

      mockAnalyticsService.getEmployeePerformance.mockResolvedValue(
        mockStats as any
      );

      // Act
      const response = await request(app)
        .get(`/employees/${employeeId}/performance`)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        averageemployeerating: 4.0,
        averagespeedservice: 4.2,
        averagefoodsatisfaction: 4.5,
        reviewcount: 10,
      });
      expect(mockAnalyticsService.getEmployeePerformance).toHaveBeenCalledWith(
        employeeId
      );
    });

    it("should return 400 for invalid employee ID", async () => {
      // Act
      const response = await request(app)
        .get("/employees/invalid/performance")
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "ID de empleado inválido",
        error: "El ID debe ser un número válido",
      });
      expect(
        mockAnalyticsService.getEmployeePerformance
      ).not.toHaveBeenCalled();
    });

    it("should return 404 when employee not found", async () => {
      // Arrange
      const employeeId = 999;
      mockAnalyticsService.getEmployeePerformance.mockRejectedValue(
        new Error("Employee not found")
      );

      // Act
      const response = await request(app)
        .get(`/employees/${employeeId}/performance`)
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Empleado no encontrado",
        error: "El empleado especificado no existe",
      });
      expect(mockAnalyticsService.getEmployeePerformance).toHaveBeenCalledWith(
        employeeId
      );
    });

    it("should handle other service errors", async () => {
      // Arrange
      const employeeId = 1;
      mockAnalyticsService.getEmployeePerformance.mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const response = await request(app)
        .get(`/employees/${employeeId}/performance`)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error interno del servidor",
        error: "Ocurrió un error al obtener el rendimiento del empleado",
      });
      expect(mockAnalyticsService.getEmployeePerformance).toHaveBeenCalledWith(
        employeeId
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle unsupported HTTP methods", async () => {
      // Act
      const response = await request(app).post("/employees").expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Endpoint no encontrado",
        error: "El endpoint solicitado no existe",
      });
    });

    it("should handle non-existent endpoints", async () => {
      // Act
      const response = await request(app)
        .get("/analytics/nonexistent")
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Endpoint no encontrado",
        error: "El endpoint solicitado no existe",
      });
    });
  });
});
