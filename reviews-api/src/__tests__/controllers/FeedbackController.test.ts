import { Request, Response } from 'express';
import { FeedbackController } from '../../controllers/FeedbackController';
import { FeedbackService } from '../../services/FeedbackService';
import { ReviewDTO } from '../../dto/ReviewDTO';

// Mock the service
jest.mock('../../services/FeedbackService');

const MockedFeedbackService = FeedbackService as jest.MockedClass<typeof FeedbackService>;

describe('FeedbackController', () => {
  let feedbackController: FeedbackController;
  let mockFeedbackService: jest.Mocked<FeedbackService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock service
    mockFeedbackService = new MockedFeedbackService() as jest.Mocked<FeedbackService>;
    
    // Create controller
    feedbackController = new FeedbackController();
    (feedbackController as any).feedbackService = mockFeedbackService;
    
    // Setup mock response
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  describe('submitReview', () => {
    it('should successfully submit a review', async () => {
      // Arrange
      const reviewData = {
        speedRating: 4,
        foodRating: 5,
        idEmployeeSelected: 1,
        employeeRating: 4,
        comment: 'Great service!',
        isPublic: true,
      };

      mockRequest = {
        body: reviewData,
      };

      const mockServiceResponse = {
        success: true,
        message: 'Review enviada exitosamente',
        data: {
          reviewId: 1,
          employeeName: 'Juan Pérez',
          averageRating: 4.25,
        },
      };

      mockFeedbackService.submitReview.mockResolvedValue(mockServiceResponse);

      // Act
      await feedbackController.submitReview(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
      expect(mockFeedbackService.submitReview).toHaveBeenCalledWith(
        expect.any(ReviewDTO)
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('should handle validation errors', async () => {
      // Arrange
      const reviewData = {
        speedRating: 6, // Invalid rating
        foodRating: 5,
        idEmployeeSelected: 1,
        employeeRating: 4,
        comment: 'Great service!',
        isPublic: true,
      };

      mockRequest = {
        body: reviewData,
      };

      const mockServiceResponse = {
        success: false,
        message: 'Datos de review inválidos',
        error: 'Los datos proporcionados no cumplen con los requisitos de validación',
      };

      mockFeedbackService.submitReview.mockResolvedValue(mockServiceResponse);

      // Act
      await feedbackController.submitReview(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('should handle employee not found error', async () => {
      // Arrange
      const reviewData = {
        speedRating: 4,
        foodRating: 5,
        idEmployeeSelected: 999, // Non-existent employee
        employeeRating: 4,
        comment: 'Great service!',
        isPublic: true,
      };

      mockRequest = {
        body: reviewData,
      };

      const mockServiceResponse = {
        success: false,
        message: 'Empleado no encontrado',
        error: 'El empleado especificado no existe en el sistema',
      };

      mockFeedbackService.submitReview.mockResolvedValue(mockServiceResponse);

      // Act
      await feedbackController.submitReview(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('should handle server errors', async () => {
      // Arrange
      const reviewData = {
        speedRating: 4,
        foodRating: 5,
        idEmployeeSelected: null,
        employeeRating: null,
        comment: 'Great service!',
        isPublic: true,
      };

      mockRequest = {
        body: reviewData,
      };

      const mockServiceResponse = {
        success: false,
        message: 'Error interno del servidor',
        error: 'Ocurrió un error al procesar la review',
      };

      mockFeedbackService.submitReview.mockResolvedValue(mockServiceResponse);

      // Act
      await feedbackController.submitReview(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('should handle missing request body', async () => {
      // Arrange
      mockRequest = {};

      // Act
      await feedbackController.submitReview(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.submitReview).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Datos de entrada requeridos',
        error: 'El cuerpo de la solicitud está vacío o es inválido',
      });
    });

    it('should handle service exceptions', async () => {
      // Arrange
      const reviewData = {
        speedRating: 4,
        foodRating: 5,
        idEmployeeSelected: null,
        employeeRating: null,
        comment: 'Great service!',
        isPublic: true,
      };

      mockRequest = {
        body: reviewData,
      };

      mockFeedbackService.submitReview.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      await feedbackController.submitReview(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.submitReview).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Error interno del servidor',
        error: 'Ocurrió un error inesperado al procesar la solicitud',
      });
    });
  });

  describe('getPublicReviews', () => {
    it('should return public reviews successfully', async () => {
      // Arrange
      const mockReviews = [
        {
          getId: () => 1,
          getSpeedRating: () => 4,
          getFoodRating: () => 5,
          getIdEmployee: () => null,
          getEmployeeRating: () => null,
          getComment: () => 'Great food!',
          getIsPublic: () => true,
          getCreatedAt: () => new Date(),
        },
        {
          getId: () => 2,
          getSpeedRating: () => 3,
          getFoodRating: () => 4,
          getIdEmployee: () => 1,
          getEmployeeRating: () => 4,
          getComment: () => 'Good service',
          getIsPublic: () => true,
          getCreatedAt: () => new Date(),
        },
      ];

      mockFeedbackService.getPublicReviews.mockResolvedValue(mockReviews as any);

      // Act
      await feedbackController.getPublicReviews(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.getPublicReviews).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Reviews públicas obtenidas exitosamente',
        data: [
          {
            idreview: 1,
            idemployee: null,
            date: expect.any(Date),
            ratespeedservice: 4,
            ratesatisfactionfood: 5,
            rateemployee: null,
            comment: 'Great food!',
            ispublic: true,
          },
          {
            idreview: 2,
            idemployee: 1,
            date: expect.any(Date),
            ratespeedservice: 3,
            ratesatisfactionfood: 4,
            rateemployee: 4,
            comment: 'Good service',
            ispublic: true,
          },
        ],
      });
    });

    it('should handle service errors when fetching public reviews', async () => {
      // Arrange
      mockFeedbackService.getPublicReviews.mockRejectedValue(
        new Error('Database error')
      );

      // Act
      await feedbackController.getPublicReviews(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFeedbackService.getPublicReviews).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Error interno del servidor',
        error: 'Ocurrió un error inesperado al obtener las reviews',
      });
    });
  });
}); 