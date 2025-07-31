import analyticsService from '../../../src/services/analyticsService.js';
import pool from '../../../src/config/database.js';

// Mock the database pool
jest.mock('../../../src/config/database.js');

describe('Analytics Service', () => {
  let mockPool;

  beforeEach(() => {
    mockPool = {
      query: jest.fn()
    };
    pool.query = mockPool.query;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateEmployeeStats', () => {
    it('should calculate statistics for employee with reviews', async () => {
      const employeeId = 1;
      const mockReviews = [
        {
          ratespeedservice: 4,
          ratesatisfactionfood: 5,
          rateemployee: 4,
          ispublic: true
        },
        {
          ratespeedservice: 5,
          ratesatisfactionfood: 4,
          rateemployee: 5,
          ispublic: true
        },
        {
          ratespeedservice: 3,
          ratesatisfactionfood: 3,
          rateemployee: null,
          ispublic: false
        }
      ];

      mockPool.query.mockResolvedValueOnce({
        rows: mockReviews
      });

      const result = await analyticsService.calculateEmployeeStats(employeeId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [employeeId]
      );
      expect(result).toEqual({
        employeeId: 1,
        totalReviews: 3,
        averageSpeedService: 4,
        averageFoodSatisfaction: 4,
        averageEmployeeRating: 4.5,
        publicReviews: 2,
        privateReviews: 1
      });
    });

    it('should handle employee with no reviews', async () => {
      const employeeId = 999;
      
      mockPool.query.mockResolvedValueOnce({
        rows: []
      });

      const result = await analyticsService.calculateEmployeeStats(employeeId);

      expect(result).toEqual({
        employeeId: 999,
        totalReviews: 0,
        averageSpeedService: 0,
        averageFoodSatisfaction: 0,
        averageEmployeeRating: 0,
        publicReviews: 0,
        privateReviews: 0
      });
    });

    it('should handle employee with only null employee ratings', async () => {
      const employeeId = 2;
      const mockReviews = [
        {
          ratespeedservice: 4,
          ratesatisfactionfood: 5,
          rateemployee: null,
          ispublic: true
        },
        {
          ratespeedservice: 3,
          ratesatisfactionfood: 4,
          rateemployee: null,
          ispublic: true
        }
      ];

      mockPool.query.mockResolvedValueOnce({
        rows: mockReviews
      });

      const result = await analyticsService.calculateEmployeeStats(employeeId);

      expect(result).toEqual({
        employeeId: 2,
        totalReviews: 2,
        averageSpeedService: 3.5,
        averageFoodSatisfaction: 4.5,
        averageEmployeeRating: 0,
        publicReviews: 2,
        privateReviews: 0
      });
    });

    it('should handle employee with mixed null and non-null employee ratings', async () => {
      const employeeId = 3;
      const mockReviews = [
        {
          ratespeedservice: 5,
          ratesatisfactionfood: 5,
          rateemployee: 5,
          ispublic: true
        },
        {
          ratespeedservice: 4,
          ratesatisfactionfood: 4,
          rateemployee: null,
          ispublic: true
        },
        {
          ratespeedservice: 3,
          ratesatisfactionfood: 3,
          rateemployee: 3,
          ispublic: false
        }
      ];

      mockPool.query.mockResolvedValueOnce({
        rows: mockReviews
      });

      const result = await analyticsService.calculateEmployeeStats(employeeId);

      expect(result).toEqual({
        employeeId: 3,
        totalReviews: 3,
        averageSpeedService: 4,
        averageFoodSatisfaction: 4,
        averageEmployeeRating: 4,
        publicReviews: 2,
        privateReviews: 1
      });
    });

    it('should handle database errors', async () => {
      const employeeId = 1;
      const dbError = new Error('Database connection failed');
      
      mockPool.query.mockRejectedValueOnce(dbError);

      await expect(analyticsService.calculateEmployeeStats(employeeId))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle decimal averages correctly', async () => {
      const employeeId = 4;
      const mockReviews = [
        {
          ratespeedservice: 4,
          ratesatisfactionfood: 5,
          rateemployee: 4,
          ispublic: true
        },
        {
          ratespeedservice: 5,
          ratesatisfactionfood: 4,
          rateemployee: 5,
          ispublic: true
        },
        {
          ratespeedservice: 3,
          ratesatisfactionfood: 3,
          rateemployee: 3,
          ispublic: true
        }
      ];

      mockPool.query.mockResolvedValueOnce({
        rows: mockReviews
      });

      const result = await analyticsService.calculateEmployeeStats(employeeId);

      expect(result.averageSpeedService).toBe(4);
      expect(result.averageFoodSatisfaction).toBe(4);
      expect(result.averageEmployeeRating).toBe(4);
    });

    it('should handle edge case with single review', async () => {
      const employeeId = 5;
      const mockReviews = [
        {
          ratespeedservice: 1,
          ratesatisfactionfood: 1,
          rateemployee: 1,
          ispublic: true
        }
      ];

      mockPool.query.mockResolvedValueOnce({
        rows: mockReviews
      });

      const result = await analyticsService.calculateEmployeeStats(employeeId);

      expect(result).toEqual({
        employeeId: 5,
        totalReviews: 1,
        averageSpeedService: 1,
        averageFoodSatisfaction: 1,
        averageEmployeeRating: 1,
        publicReviews: 1,
        privateReviews: 0
      });
    });

    it('should handle all private reviews', async () => {
      const employeeId = 6;
      const mockReviews = [
        {
          ratespeedservice: 4,
          ratesatisfactionfood: 4,
          rateemployee: 4,
          ispublic: false
        },
        {
          ratespeedservice: 5,
          ratesatisfactionfood: 5,
          rateemployee: 5,
          ispublic: false
        }
      ];

      mockPool.query.mockResolvedValueOnce({
        rows: mockReviews
      });

      const result = await analyticsService.calculateEmployeeStats(employeeId);

      expect(result).toEqual({
        employeeId: 6,
        totalReviews: 2,
        averageSpeedService: 4.5,
        averageFoodSatisfaction: 4.5,
        averageEmployeeRating: 4.5,
        publicReviews: 0,
        privateReviews: 2
      });
    });
  });
}); 