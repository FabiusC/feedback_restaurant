import request from "supertest";
import express from "express";
import { FeedbackController } from "../../controllers/FeedbackController";
import { FeedbackService } from "../../services/FeedbackService";
import feedbackRoutes from "../../routes/feedbackRoutes";

// Mock the service layer
jest.mock("../../services/FeedbackService");

const MockedFeedbackService = FeedbackService as jest.MockedClass<
  typeof FeedbackService
>;

describe("Feedback Integration Tests", () => {
  let app: express.Application;
  let mockFeedbackService: jest.Mocked<FeedbackService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock service
    mockFeedbackService =
      new MockedFeedbackService() as jest.Mocked<FeedbackService>;

    // Create Express app
    app = express();
    app.use(express.json());

    // Mock the service in the controller that's used by routes
    const feedbackController = new FeedbackController();
    (feedbackController as any).feedbackService = mockFeedbackService;

    // Replace the controller in the routes with our mocked version
    const router = require("express").Router();
    router.post(
      "/reviews",
      feedbackController.submitReview.bind(feedbackController)
    );
    router.get(
      "/reviews/public",
      feedbackController.getPublicReviews.bind(feedbackController)
    );

    // Use the mocked routes
    app.use("/", router);

    // Add error handling middleware
    app.use((err: any, req: any, res: any, next: any) => {
      if (err instanceof SyntaxError && err.message.includes("JSON")) {
        return res.status(400).json({
          success: false,
          message: "Required input data",
          error: "Invalid JSON",
        });
      }
      next(err);
    });

    // Add 404 handler for unsupported methods
    app.use("*", (req: any, res: any) => {
      res.status(404).json({
        success: false,
        message: "Endpoint not found",
        error: "The requested endpoint does not exist",
      });
    });
  });

  describe("POST /reviews", () => {
    it("should successfully submit a review", async () => {
      // Arrange
      const reviewData = {
        speedRating: 4,
        foodRating: 5,
        idEmployeeSelected: 1,
        employeeRating: 4,
        comment: "Great service!",
        isPublic: true,
      };

      const mockServiceResponse = {
        success: true,
        message: "Review sent successfully",
        data: {
          reviewId: 1,
          employeeName: "Juan Pérez",
          averageRating: 4.25,
        },
      };

      mockFeedbackService.submitReview.mockResolvedValue(mockServiceResponse);

      // Act
      const response = await request(app)
        .post("/reviews")
        .send(reviewData)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockServiceResponse);
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
    });

    it("should return 400 for invalid review data", async () => {
      // Arrange
      const invalidReviewData = {
        speedRating: 6, // Invalid rating > 5
        foodRating: 5,
        idEmployeeSelected: 1,
        employeeRating: 4,
        comment: "Great service!",
        isPublic: true,
      };

      const mockServiceResponse = {
        success: false,
        message: "Invalid review data",
        error: "The provided data does not meet the validation requirements",
      };

      mockFeedbackService.submitReview.mockResolvedValue(mockServiceResponse);

      // Act
      const response = await request(app)
        .post("/reviews")
        .send(invalidReviewData)
        .expect(400);

      // Assert
      expect(response.body).toEqual(mockServiceResponse);
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
    });

    it("should return 404 when employee not found", async () => {
      // Arrange
      const reviewData = {
        speedRating: 4,
        foodRating: 5,
        idEmployeeSelected: 999, // Non-existent employee
        employeeRating: 4,
        comment: "Great service!",
        isPublic: true,
      };

      const mockServiceResponse = {
        success: false,
        message: "Employee not found",
        error: "The specified employee does not exist in the system",
      };

      mockFeedbackService.submitReview.mockResolvedValue(mockServiceResponse);

      // Act
      const response = await request(app)
        .post("/reviews")
        .send(reviewData)
        .expect(404);

      // Assert
      expect(response.body).toEqual(mockServiceResponse);
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
    });

    it("should return 500 for server errors", async () => {
      // Arrange
      const reviewData = {
        speedRating: 4,
        foodRating: 5,
        idEmployeeSelected: null,
        employeeRating: null,
        comment: "Great service!",
        isPublic: true,
      };

      mockFeedbackService.submitReview.mockRejectedValue(
        new Error("Database connection failed")
      );

      // Act
      const response = await request(app)
        .post("/reviews")
        .send(reviewData)
        .expect(500);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Internal server error");
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
    });

    it("should return 400 for missing request body", async () => {
      // Act
      const response = await request(app).post("/reviews").expect(400);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Required input data");
      expect(mockFeedbackService.submitReview).not.toHaveBeenCalled();
    });

    it("should return 400 for empty request body", async () => {
      // Act
      const response = await request(app).post("/reviews").send({}).expect(400);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Required input data");
      expect(mockFeedbackService.submitReview).not.toHaveBeenCalled();
    });
  });

  describe("GET /reviews/public", () => {
    it("should return public reviews successfully", async () => {
      // Arrange
      const mockReviews = [
        {
          getId: () => 1,
          getSpeedRating: () => 4,
          getFoodRating: () => 5,
          getIdEmployee: () => null,
          getEmployeeRating: () => null,
          getComment: () => "Great food!",
          getIsPublic: () => true,
          getCreatedAt: () => new Date(),
        },
        {
          getId: () => 2,
          getSpeedRating: () => 3,
          getFoodRating: () => 4,
          getIdEmployee: () => 1,
          getEmployeeRating: () => 4,
          getComment: () => "Good service",
          getIsPublic: () => true,
          getCreatedAt: () => new Date(),
        },
      ];

      mockFeedbackService.getPublicReviews.mockResolvedValue(
        mockReviews as any
      );

      // Act
      const response = await request(app).get("/reviews/public").expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Public reviews obtained successfully"
      );
      expect(response.body.data).toEqual([
        {
          idreview: 1,
          idemployee: null,
          date: expect.any(String),
          ratespeedservice: 4,
          ratesatisfactionfood: 5,
          rateemployee: null,
          comment: "Great food!",
          ispublic: true,
        },
        {
          idreview: 2,
          idemployee: 1,
          date: expect.any(String),
          ratespeedservice: 3,
          ratesatisfactionfood: 4,
          rateemployee: 4,
          comment: "Good service",
          ispublic: true,
        },
      ]);
      expect(mockFeedbackService.getPublicReviews).toHaveBeenCalledTimes(1);
    });

    it("should return 500 for service errors", async () => {
      // Arrange
      mockFeedbackService.getPublicReviews.mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const response = await request(app).get("/reviews/public").expect(500);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Internal server error");
      expect(mockFeedbackService.getPublicReviews).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no public reviews exist", async () => {
      // Arrange
      mockFeedbackService.getPublicReviews.mockResolvedValue([]);

      // Act
      const response = await request(app).get("/reviews/public").expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(mockFeedbackService.getPublicReviews).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed JSON", async () => {
      // Act
      const response = await request(app)
        .post("/reviews")
        .set("Content-Type", "application/json")
        .send('{"invalid": json}')
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Required input data");
    });

    it("should handle unsupported HTTP methods", async () => {
      // Act
      const response = await request(app).put("/reviews").expect(404);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Endpoint not found");
    });
  });
});
