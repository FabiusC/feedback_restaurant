import { ReviewRepository } from "../../data/repositories/ReviewRepository";
import { Review } from "../../entities/Review";
import DatabaseConnection from "../../data/database/connection";

// Mock the database connection
jest.mock("../../data/database/connection");

describe("ReviewRepository", () => {
  let reviewRepository: ReviewRepository;
  let mockDb: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock database connection
    mockDb = {
      query: jest.fn(),
    };

    // Mock the singleton instance
    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue(mockDb);

    // Create repository
    reviewRepository = new ReviewRepository();
  });

  describe("save", () => {
    it("should save review successfully", async () => {
      // Arrange
      const review = new Review(0, 4, 5, 1, 4, "Great service!", true);
      const mockRow = {
        idreview: 1,
        date: "2024-01-01T00:00:00.000Z",
      };

      mockDb.query.mockResolvedValue({ rows: [mockRow] });

      // Act
      const result = await reviewRepository.save(review);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        `INSERT INTO review (ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING idreview, date`,
        [4, 5, 1, 4, "Great service!", true]
      );
      expect(result).toBeInstanceOf(Review);
      expect(result.getId()).toBe(1);
      expect(result.getSpeedRating()).toBe(4);
      expect(result.getFoodRating()).toBe(5);
      expect(result.getIdEmployee()).toBe(1);
      expect(result.getEmployeeRating()).toBe(4);
      expect(result.getComment()).toBe("Great service!");
      expect(result.getIsPublic()).toBe(true);
    });

    it("should save review without employee successfully", async () => {
      // Arrange
      const review = new Review(0, 4, 5, null, null, "Great food!", true);
      const mockRow = {
        idreview: 1,
        date: "2024-01-01T00:00:00.000Z",
      };

      mockDb.query.mockResolvedValue({ rows: [mockRow] });

      // Act
      const result = await reviewRepository.save(review);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        `INSERT INTO review (ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING idreview, date`,
        [4, 5, null, null, "Great food!", true]
      );
      expect(result).toBeInstanceOf(Review);
      expect(result.getId()).toBe(1);
      expect(result.getIdEmployee()).toBeNull();
      expect(result.getEmployeeRating()).toBeNull();
    });

    it("should handle database errors", async () => {
      // Arrange
      const review = new Review(0, 4, 5, 1, 4, "Great service!", true);
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reviewRepository.save(review)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        `INSERT INTO review (ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING idreview, date`,
        [4, 5, 1, 4, "Great service!", true]
      );
    });
  });

  describe("findPublicReviews", () => {
    it("should return public reviews successfully", async () => {
      // Arrange
      const mockRows = [
        {
          idreview: 1,
          ratespeedservice: 4,
          ratesatisfactionfood: 5,
          idemployee: 1,
          rateemployee: 4,
          comment: "Great service!",
          ispublic: true,
          date: "2024-01-01T00:00:00.000Z",
        },
        {
          idreview: 2,
          ratespeedservice: 3,
          ratesatisfactionfood: 4,
          idemployee: null,
          rateemployee: null,
          comment: "Good food!",
          ispublic: true,
          date: "2024-01-02T00:00:00.000Z",
        },
      ];

      mockDb.query.mockResolvedValue({ rows: mockRows });

      // Act
      const result = await reviewRepository.findPublicReviews();

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE ispublic = true ORDER BY date DESC"
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Review);
      expect(result[0].getId()).toBe(1);
      expect(result[0].getSpeedRating()).toBe(4);
      expect(result[0].getFoodRating()).toBe(5);
      expect(result[0].getIdEmployee()).toBe(1);
      expect(result[0].getEmployeeRating()).toBe(4);
      expect(result[0].getComment()).toBe("Great service!");
      expect(result[0].getIsPublic()).toBe(true);
      expect(result[1].getId()).toBe(2);
      expect(result[1].getIdEmployee()).toBeNull();
      expect(result[1].getEmployeeRating()).toBeNull();
    });

    it("should return empty array when no public reviews exist", async () => {
      // Arrange
      mockDb.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await reviewRepository.findPublicReviews();

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE ispublic = true ORDER BY date DESC"
      );
      expect(result).toHaveLength(0);
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reviewRepository.findPublicReviews()).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE ispublic = true ORDER BY date DESC"
      );
    });
  });

  describe("findByEmployee", () => {
    it("should return reviews for employee successfully", async () => {
      // Arrange
      const employeeId = 1;
      const mockRows = [
        {
          idreview: 1,
          ratespeedservice: 4,
          ratesatisfactionfood: 5,
          idemployee: 1,
          rateemployee: 4,
          comment: "Great service!",
          ispublic: true,
          date: "2024-01-01T00:00:00.000Z",
        },
        {
          idreview: 2,
          ratespeedservice: 3,
          ratesatisfactionfood: 4,
          idemployee: 1,
          rateemployee: 3,
          comment: "Good service!",
          ispublic: false,
          date: "2024-01-02T00:00:00.000Z",
        },
      ];

      mockDb.query.mockResolvedValue({ rows: mockRows });

      // Act
      const result = await reviewRepository.findByEmployee(employeeId);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE idemployee = $1 ORDER BY date DESC",
        [employeeId]
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Review);
      expect(result[0].getId()).toBe(1);
      expect(result[0].getIdEmployee()).toBe(1);
      expect(result[1].getId()).toBe(2);
      expect(result[1].getIdEmployee()).toBe(1);
    });

    it("should return empty array when employee has no reviews", async () => {
      // Arrange
      const employeeId = 999;
      mockDb.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await reviewRepository.findByEmployee(employeeId);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE idemployee = $1 ORDER BY date DESC",
        [employeeId]
      );
      expect(result).toHaveLength(0);
    });

    it("should handle database errors", async () => {
      // Arrange
      const employeeId = 1;
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reviewRepository.findByEmployee(employeeId)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE idemployee = $1 ORDER BY date DESC",
        [employeeId]
      );
    });
  });

  describe("getEmployeeStats", () => {
    it("should return employee stats successfully", async () => {
      // Arrange
      const employeeId = 1;
      const mockRow = {
        averageemployeerating: "4.2",
        averagespeedservice: "4.5",
        averagefoodsatisfaction: "4.0",
        reviewcount: "10",
      };

      mockDb.query.mockResolvedValue({ rows: [mockRow] });

      // Act
      const result = await reviewRepository.getEmployeeStats(employeeId);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        `SELECT 
          AVG(rateemployee) AS averageemployeerating,
          AVG(ratespeedservice) AS averagespeedservice,
          AVG(ratesatisfactionfood) AS averagefoodsatisfaction,
          COUNT(*) AS reviewcount
        FROM review
        WHERE idemployee = $1 AND rateemployee IS NOT NULL`,
        [employeeId]
      );
      expect(result).toEqual({
        averageemployeerating: 4.2,
        averagespeedservice: 4.5,
        averagefoodsatisfaction: 4.0,
        reviewcount: 10,
      });
    });

    it("should handle null values in stats", async () => {
      // Arrange
      const employeeId = 1;
      const mockRow = {
        averageemployeerating: null,
        averagespeedservice: null,
        averagefoodsatisfaction: null,
        reviewcount: "0",
      };

      mockDb.query.mockResolvedValue({ rows: [mockRow] });

      // Act
      const result = await reviewRepository.getEmployeeStats(employeeId);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        `SELECT 
          AVG(rateemployee) AS averageemployeerating,
          AVG(ratespeedservice) AS averagespeedservice,
          AVG(ratesatisfactionfood) AS averagefoodsatisfaction,
          COUNT(*) AS reviewcount
        FROM review
        WHERE idemployee = $1 AND rateemployee IS NOT NULL`,
        [employeeId]
      );
      expect(result).toEqual({
        averageemployeerating: 0,
        averagespeedservice: 0,
        averagefoodsatisfaction: 0,
        reviewcount: 0,
      });
    });

    it("should handle database errors", async () => {
      // Arrange
      const employeeId = 1;
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        reviewRepository.getEmployeeStats(employeeId)
      ).rejects.toThrow("Database connection failed");
      expect(mockDb.query).toHaveBeenCalledWith(
        `SELECT 
          AVG(rateemployee) AS averageemployeerating,
          AVG(ratespeedservice) AS averagespeedservice,
          AVG(ratesatisfactionfood) AS averagefoodsatisfaction,
          COUNT(*) AS reviewcount
        FROM review
        WHERE idemployee = $1 AND rateemployee IS NOT NULL`,
        [employeeId]
      );
    });
  });
});
