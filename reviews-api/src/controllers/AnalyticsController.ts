import { Request, Response } from "express";
import { AnalyticsService } from "../services/AnalyticsService";
import { EmployeeRepository } from "../data/repositories/EmployeeRepository";

export class AnalyticsController {
  private analyticsService: AnalyticsService;
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.analyticsService = new AnalyticsService();
    this.employeeRepository = new EmployeeRepository();
  }

  public async getEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await this.employeeRepository.findActiveEmployees();

      const employeesData = employees.map((employee) => ({
        idemployee: employee.getId(),
        name: employee.getName(),
        email: employee.getEmail(),
        isactive: employee.getIsActive(),
        createdat: employee.getCreatedAt(),
      }));

      res.status(200).json(employeesData);
    } catch (error) {
      console.error("Error in getEmployees controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "An error occurred while getting the employees",
      });
    }
  }

  public async getEmployeePerformance(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const employeeId = parseInt(req.params.id);

      if (isNaN(employeeId)) {
        res.status(400).json({
          success: false,
          message: "Invalid employee ID",
          error: "The ID must be a valid number",
        });
        return;
      }

      const performance = await this.analyticsService.getEmployeePerformance(
        employeeId
      );

      res.status(200).json(performance.toJSON());
    } catch (error) {
      console.error("Error in getEmployeePerformance controller:", error);

      if (error instanceof Error && error.message === "Employee not found") {
        res.status(404).json({
          success: false,
          message: "Employee not found",
          error: "The specified employee does not exist",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: "An error occurred while getting the employee performance",
        });
      }
    }
  }
}
