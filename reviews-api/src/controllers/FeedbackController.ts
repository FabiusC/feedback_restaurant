import { Request, Response } from "express";
import { FeedbackService } from "../services/FeedbackService";
import { ReviewDTO } from "../dto/ReviewDTO";

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor() {
    this.feedbackService = new FeedbackService();
  }

  // Submit a review
  public async submitReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewData = req.body;

      // Create DTO from request body
      const reviewDTO = ReviewDTO.fromJSON(reviewData);

      // Submit review through service
      const result = await this.feedbackService.submitReview(reviewDTO);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in submitReview controller:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: "Ocurrió un error al procesar la solicitud",
      });
    }
  }

  // Get public reviews
  public async getPublicReviews(req: Request, res: Response): Promise<void> {
    try {
      const reviews = await this.feedbackService.getPublicReviews();

      const reviewsData = reviews.map((review) => ({
        idreview: review.getId(),
        idemployee: review.getIdEmployee(),
        date: review.getCreatedAt(),
        ratespeedservice: review.getSpeedRating(),
        ratesatisfactionfood: review.getFoodRating(),
        rateemployee: review.getEmployeeRating(),
        comment: review.getComment(),
        ispublic: review.getIsPublic(),
      }));

      res.status(200).json(reviewsData);
    } catch (error) {
      console.error("Error in getPublicReviews controller:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: "Ocurrió un error al obtener las reviews",
      });
    }
  }
}
