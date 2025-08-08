import { FeedbackService, Response } from "../../services/FeedbackService";
import { ReviewRepository } from "../../data/repositories/ReviewRepository";
import { EmployeeRepository } from "../../data/repositories/EmployeeRepository";
import { ReviewDTO } from "../../dto/ReviewDTO";
import { Review } from "../../entities/Review";
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

describe("FeedbackService", () => {
  let feedbackService: FeedbackService;
  let mockReviewRepository: jest.Mocked<ReviewRepository>;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create new instances
    feedbackService = new FeedbackService();
    mockReviewRepository =
      new MockedReviewRepository() as jest.Mocked<ReviewRepository>;
    mockEmployeeRepository =
      new MockedEmployeeRepository() as jest.Mocked<EmployeeRepository>;

    // Replace the repositories in the service with our mocked versions
    (feedbackService as any).reviewRepository = mockReviewRepository;
    (feedbackService as any).employeeRepository = mockEmployeeRepository;
  });

  describe("submitReview", () => {
    it("should successfully submit a valid review", async () => {
      // Arrange
      const reviewDTO = new ReviewDTO();
      reviewDTO.setSpeedRating(4);
      reviewDTO.setFoodRating(5);
      reviewDTO.setIdEmployeeSelected(1);
      reviewDTO.setEmployeeRating(4);
      reviewDTO.setComment("Excellent service");
      reviewDTO.setIsPublic(true);

      const mockEmployee = new Employee(1, "Juan Pérez", "true");
      const mockSavedReview = new Review(
        1,
        4,
        5,
        1,
        4,
        "Excellent service",
        true
      );

      // Mock DTO validation
      jest.spyOn(reviewDTO, "validate").mockReturnValue(true);

      // Mock employee repository
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // Mock review validation
      jest.spyOn(mockSavedReview, "validate").mockReturnValue(true);

      // Mock review repository
      mockReviewRepository.save.mockResolvedValue(mockSavedReview);

      // Act
      const result: Response = await feedbackService.submitReview(reviewDTO);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Review sent successfully");
      expect(result.data).toEqual({
        reviewId: 1,
        employeeName: "Juan Pérez",
        averageRating: expect.closeTo(4.33, 2), // (4+5+4)/3
      });
      expect(mockReviewRepository.save).toHaveBeenCalledTimes(1);
    });

    it("should fail when DTO validation fails", async () => {
      // Arrange
      const reviewDTO = new ReviewDTO();
      reviewDTO.setSpeedRating(-1); // Invalid rating
      reviewDTO.setFoodRating(5);
      reviewDTO.setIdEmployeeSelected(null);
      reviewDTO.setEmployeeRating(null);
      reviewDTO.setComment("Test comment");
      reviewDTO.setIsPublic(true);

      // Mock DTO validation to fail
      jest.spyOn(reviewDTO, "validate").mockReturnValue(false);

      // Act
      const result: Response = await feedbackService.submitReview(reviewDTO);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid review data");
      expect(result.error).toBe(
        "The provided data does not meet the validation requirements"
      );
      expect(mockReviewRepository.save).not.toHaveBeenCalled();
    });

    it("should fail when employee does not exist", async () => {
      // Arrange
      const reviewDTO = new ReviewDTO();
      reviewDTO.setSpeedRating(4);
      reviewDTO.setFoodRating(5);
      reviewDTO.setIdEmployeeSelected(999); // Non-existent employee
      reviewDTO.setEmployeeRating(4);
      reviewDTO.setComment("Test comment");
      reviewDTO.setIsPublic(true);

      // Mock DTO validation
      jest.spyOn(reviewDTO, "validate").mockReturnValue(true);

      // Mock employee repository to return null
      mockEmployeeRepository.findById.mockResolvedValue(null);

      // Act
      const result: Response = await feedbackService.submitReview(reviewDTO);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Employee not found");
      expect(result.error).toBe(
        "The specified employee does not exist in the system"
      );
      expect(mockReviewRepository.save).not.toHaveBeenCalled();
    });

    it("should fail when employee is inactive", async () => {
      // Arrange
      const reviewDTO = new ReviewDTO();
      reviewDTO.setSpeedRating(4);
      reviewDTO.setFoodRating(5);
      reviewDTO.setIdEmployeeSelected(1);
      reviewDTO.setEmployeeRating(4);
      reviewDTO.setComment("Test comment");
      reviewDTO.setIsPublic(true);

      const mockInactiveEmployee = new Employee(
        1,
        "Juan Pérez",
        "juan.perez@example.com",
        false
      ); // inactive

      // Mock DTO validation
      jest.spyOn(reviewDTO, "validate").mockReturnValue(true);

      // Mock employee repository
      mockEmployeeRepository.findById.mockResolvedValue(mockInactiveEmployee);

      // Act
      const result: Response = await feedbackService.submitReview(reviewDTO);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Inactive employee");
      expect(result.error).toBe("The specified employee is inactive");
      expect(mockReviewRepository.save).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const reviewDTO = new ReviewDTO();
      reviewDTO.setSpeedRating(4);
      reviewDTO.setFoodRating(5);
      reviewDTO.setIdEmployeeSelected(null);
      reviewDTO.setEmployeeRating(null);
      reviewDTO.setComment("Test comment");
      reviewDTO.setIsPublic(true);

      // Mock DTO validation
      jest.spyOn(reviewDTO, "validate").mockReturnValue(true);

      // Mock review repository to throw error
      mockReviewRepository.save.mockRejectedValue(
        new Error("Database connection failed")
      );

      // Act
      const result: Response = await feedbackService.submitReview(reviewDTO);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Internal server error");
      expect(result.error).toBe(
        "An error occurred while processing the review"
      );
    });

    it("should successfully submit review without employee", async () => {
      // Arrange
      const reviewDTO = new ReviewDTO();
      reviewDTO.setSpeedRating(4);
      reviewDTO.setFoodRating(5);
      reviewDTO.setIdEmployeeSelected(null);
      reviewDTO.setEmployeeRating(null);
      reviewDTO.setComment("Excellent food");
      reviewDTO.setIsPublic(true);

      const mockSavedReview = new Review(
        1,
        4,
        5,
        null,
        null,
        "Excellent food",
        true
      );

      // Mock DTO validation
      jest.spyOn(reviewDTO, "validate").mockReturnValue(true);

      // Mock review validation
      jest.spyOn(mockSavedReview, "validate").mockReturnValue(true);

      // Mock review repository
      mockReviewRepository.save.mockResolvedValue(mockSavedReview);

      // Act
      const result: Response = await feedbackService.submitReview(reviewDTO);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Review sent successfully");
      expect(result.data).toEqual({
        reviewId: 1,
        employeeName: "Not specified",
        averageRating: 4.5, // (4+5)/2
      });
      expect(mockEmployeeRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe("getPublicReviews", () => {
    it("should return public reviews successfully", async () => {
      // Arrange
      const mockReviews = [
        new Review(1, 4, 5, null, null, "Great food!", true),
        new Review(2, 3, 4, 1, 4, "Good service", true),
      ];

      mockReviewRepository.findPublicReviews.mockResolvedValue(mockReviews);

      // Act
      const result = await feedbackService.getPublicReviews();

      // Assert
      expect(result).toEqual(mockReviews);
      expect(mockReviewRepository.findPublicReviews).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when fetching public reviews", async () => {
      // Arrange
      mockReviewRepository.findPublicReviews.mockRejectedValue(
        new Error("Database error")
      );

      // Act & Assert
      await expect(feedbackService.getPublicReviews()).rejects.toThrow(
        "Database error"
      );
      expect(mockReviewRepository.findPublicReviews).toHaveBeenCalledTimes(1);
    });
  });
});
