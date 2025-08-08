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
      // Check if request body exists
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({
          success: false,
          message: "Required input data",
          error: "The request body is empty or invalid",
        });
        return;
      }

      const reviewData = req.body;

      // Create DTO from request body
      const reviewDTO = ReviewDTO.fromJSON(reviewData);

      // Submit review through service
      const result = await this.feedbackService.submitReview(reviewDTO);

      if (result.success) {
        res.status(200).json(result);
      } else {
        // Map specific error messages to appropriate status codes
        if (result.message === "Employee not found") {
          res.status(404).json(result);
        } else if (result.message === "Employee inactive") {
          res.status(400).json(result);
        } else if (result.message === "Internal server error") {
          res.status(500).json(result);
        } else {
          res.status(400).json(result);
        }
      }
    } catch (error) {
      console.error("Error in submitReview controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "An unexpected error occurred while processing the request",
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

      res.status(200).json({
        success: true,
        message: "Public reviews obtained successfully",
        data: reviewsData,
      });
    } catch (error) {
      console.error("Error in getPublicReviews controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "An unexpected error occurred while getting the reviews",
      });
    }
  }
}
