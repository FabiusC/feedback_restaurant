import { ReviewRepository } from "../data/repositories/ReviewRepository";
import { EmployeeRepository } from "../data/repositories/EmployeeRepository";
import { Review } from "../entities/Review";
import { ReviewDTO } from "../dto/ReviewDTO";
import { ErrorManager } from "../utils/ErrorManager";

export interface Response {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class FeedbackService {
  private reviewRepository: ReviewRepository;
  private employeeRepository: EmployeeRepository;
  private errorManager: ErrorManager;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.employeeRepository = new EmployeeRepository();
    this.errorManager = ErrorManager.getInstance();
  }

  public async submitReview(dto: ReviewDTO): Promise<Response> {
    try {
      // Validate DTO
      if (!dto.validate()) {
        return {
          success: false,
          message: "Invalid review data",
          error: "The provided data does not meet the validation requirements",
        };
      }

      // Check if employee exists and is active (only if employee is selected)
      let employee = null;
      const employeeId = dto.getIdEmployeeSelected();
      if (employeeId !== null) {
        employee = await this.employeeRepository.findById(employeeId);
        if (!employee) {
          return {
            success: false,
            message: "Employee not found",
            error: "The specified employee does not exist in the system",
          };
        }

        if (!employee.getIsActive()) {
          return {
            success: false,
            message: "Inactive employee",
            error: "The specified employee is inactive",
          };
        }
      }

      // Create review entity
      const review = new Review(
        0, // ID will be assigned by database
        dto.getSpeedRating(),
        dto.getFoodRating(),
        dto.getIdEmployeeSelected(),
        dto.getEmployeeRating(),
        dto.getComment(),
        dto.getIsPublic() || false
      );

      // Validate review entity
      if (!review.validate()) {
        return {
          success: false,
          message: "Invalid review",
          error: "The review does not meet the validation rules",
        };
      }

      // Save review
      const savedReview = await this.reviewRepository.save(review);

      return {
        success: true,
        message: "Review sent successfully",
        data: {
          reviewId: savedReview.getId(),
          employeeName: employee?.getName() || "Not specified",
          averageRating: savedReview.getAverageRating(),
        },
      };
    } catch (error) {
      console.error("Error submitting review:", error);
      return {
        success: false,
        message: "Internal server error",
        error: "An error occurred while processing the review",
      };
    }
  }

  public async getPublicReviews(): Promise<Review[]> {
    try {
      return await this.reviewRepository.findPublicReviews();
    } catch (error) {
      console.error("Error getting public reviews:", error);
      throw error;
    }
  }
}
