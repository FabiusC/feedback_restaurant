import { AnalyticsService } from "../../services/AnalyticsService";
import { ReviewRepository } from "../../data/repositories/ReviewRepository";
import { EmployeeRepository } from "../../data/repositories/EmployeeRepository";
import { EmployeeStatsDTO } from "../../dto/EmployeeStatsDTO";
import { Employee } from "../../entities/Employee";

// Mock the repositories
jest.mock("../../data/repositories/ReviewRepository");
jest.mock("../../data/repositories/EmployeeRepository");

const MockedReviewRepository = ReviewRepository as jest.MockedClass<
  typeof ReviewRepository
>;
const MockedEmployeeRepository = EmployeeRepository as jest.MockedClass<
  typeof EmployeeRepository
>;

describe("AnalyticsService", () => {
  let analyticsService: AnalyticsService;
  let mockReviewRepository: jest.Mocked<ReviewRepository>;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create new instances
    analyticsService = new AnalyticsService();
    mockReviewRepository =
      new MockedReviewRepository() as jest.Mocked<ReviewRepository>;
    mockEmployeeRepository =
      new MockedEmployeeRepository() as jest.Mocked<EmployeeRepository>;

    // Replace the repositories in the service with our mocked versions
    (analyticsService as any).reviewRepository = mockReviewRepository;
    (analyticsService as any).employeeRepository = mockEmployeeRepository;
  });

  describe("getEmployeePerformance", () => {
    it("should return employee performance statistics successfully", async () => {
      // Arrange
      const employeeId = 1;
      const mockEmployee = new Employee(employeeId, "Juan Pérez", "true");
      const mockStats = {
        totalReviews: 10,
        averageRating: 4.2,
        speedRating: 4.0,
        foodRating: 4.5,
        employeeRating: 4.1,
        publicReviews: 8,
        privateReviews: 2,
      };

      // Mock employee repository
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // Mock review repository
      mockReviewRepository.getEmployeeStats.mockResolvedValue({
        averageemployeerating: mockStats.employeeRating,
        averagespeedservice: mockStats.speedRating,
        averagefoodsatisfaction: mockStats.foodRating,
        reviewcount: mockStats.totalReviews,
      });

      // Act
      const result = await analyticsService.getEmployeePerformance(employeeId);

      // Assert
      expect(result).toBeInstanceOf(EmployeeStatsDTO);
      expect(result.getEmployeeId()).toBe(employeeId);
      expect(result.getStats()).toEqual(mockStats);
      expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(mockReviewRepository.getEmployeeStats).toHaveBeenCalledWith(
        employeeId
      );
    });

    it("should throw error when employee does not exist", async () => {
      // Arrange
      const employeeId = 999;

      // Mock employee repository to return null
      mockEmployeeRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        analyticsService.getEmployeePerformance(employeeId)
      ).rejects.toThrow("Employee not found");

      expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(mockReviewRepository.getEmployeeStats).not.toHaveBeenCalled();
    });

    it("should handle database errors when fetching employee", async () => {
      // Arrange
      const employeeId = 1;
      const dbError = new Error("Database connection failed");

      // Mock employee repository to throw error
      mockEmployeeRepository.findById.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        analyticsService.getEmployeePerformance(employeeId)
      ).rejects.toThrow("Database connection failed");

      expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(mockReviewRepository.getEmployeeStats).not.toHaveBeenCalled();
    });

    it("should handle database errors when fetching stats", async () => {
      // Arrange
      const employeeId = 1;
      const mockEmployee = new Employee(
        employeeId,
        "Juan Pérez",
        "juan.perez@example.com",
        true
      );
      const dbError = new Error("Stats query failed");

      // Mock employee repository
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // Mock review repository to throw error
      mockReviewRepository.getEmployeeStats.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        analyticsService.getEmployeePerformance(employeeId)
      ).rejects.toThrow("Stats query failed");

      expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(mockReviewRepository.getEmployeeStats).toHaveBeenCalledWith(
        employeeId
      );
    });

    it("should return empty stats when employee has no reviews", async () => {
      // Arrange
      const employeeId = 1;
      const mockEmployee = new Employee(
        employeeId,
        "Juan Pérez",
        "juan.perez@example.com",
        true
      );
      const emptyStats = {
        totalReviews: 0,
        averageRating: 0,
        speedRating: 0,
        foodRating: 0,
        employeeRating: 0,
        publicReviews: 0,
        privateReviews: 0,
      };

      // Mock employee repository
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // Mock review repository
      mockReviewRepository.getEmployeeStats.mockResolvedValue({
        averageemployeerating: 0,
        averagespeedservice: 0,
        averagefoodsatisfaction: 0,
        reviewcount: 0,
      });

      // Act
      const result = await analyticsService.getEmployeePerformance(employeeId);

      // Assert
      expect(result).toBeInstanceOf(EmployeeStatsDTO);
      expect(result.getEmployeeId()).toBe(employeeId);
      expect(result.getStats()).toEqual(emptyStats);
      expect(result.getStats().totalReviews).toBe(0);
      expect(result.getStats().averageRating).toBe(0);
    });
  });
});
