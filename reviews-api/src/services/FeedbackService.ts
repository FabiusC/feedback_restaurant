import { ReviewRepository } from "../data/repositories/ReviewRepository";
import { EmployeeRepository } from "../data/repositories/EmployeeRepository";
import { Review } from "../entities/Review";
import { ReviewDTO } from "../dto/ReviewDTO";

export interface Response {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class FeedbackService {
  private reviewRepository: ReviewRepository;
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  public async submitReview(dto: ReviewDTO): Promise<Response> {
    try {
      // Validate DTO
      if (!dto.validate()) {
        return {
          success: false,
          message: "Datos de review inválidos",
          error:
            "Los datos proporcionados no cumplen con los requisitos de validación",
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
            message: "Empleado no encontrado",
            error: "El empleado especificado no existe en el sistema",
          };
        }

        if (!employee.getIsActive()) {
          return {
            success: false,
            message: "Empleado inactivo",
            error: "El empleado especificado no está activo",
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
          message: "Review inválida",
          error: "La review no cumple con las reglas de validación",
        };
      }

      // Save review
      const savedReview = await this.reviewRepository.save(review);

      return {
        success: true,
        message: "Review enviada exitosamente",
        data: {
          reviewId: savedReview.getId(),
          employeeName: employee?.getName() || "No especificado",
          averageRating: savedReview.getAverageRating(),
        },
      };
    } catch (error) {
      console.error("Error submitting review:", error);
      return {
        success: false,
        message: "Error interno del servidor",
        error: "Ocurrió un error al procesar la review",
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
