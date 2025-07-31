import { ReviewRepository } from "../data/repositories/ReviewRepository";
import { EmployeeRepository } from "../data/repositories/EmployeeRepository";
import { EmployeeStatsDTO } from "../dto/EmployeeStatsDTO";

export class AnalyticsService {
  private reviewRepository: ReviewRepository;
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  public async getEmployeePerformance(
    employeeId: number
  ): Promise<EmployeeStatsDTO> {
    try {
      // Check if employee exists
      const employee = await this.employeeRepository.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Get employee statistics directly from repository
      const stats = await this.reviewRepository.getEmployeeStats(employeeId);

      // Create EmployeeStatsDTO
      const statsDTO = new EmployeeStatsDTO(employeeId);
      statsDTO.setStats(stats);

      return statsDTO;
    } catch (error) {
      console.error("Error getting employee performance:", error);
      throw error;
    }
  }
}
