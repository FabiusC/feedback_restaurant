import errorHandler from '../../../src/middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('errorHandler', () => {
    it('should handle generic errors', () => {
      const error = new Error('Generic error message');
      error.status = 500;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Generic error message'
      });
    });

    it('should handle errors without status code', () => {
      const error = new Error('Error without status');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error without status'
      });
    });

    it('should handle errors with custom status codes', () => {
      const error = new Error('Custom error');
      error.status = 400;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Custom error'
      });
    });

    it('should handle errors with custom message property', () => {
      const error = {
        message: 'Custom message error',
        status: 404
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Custom message error'
      });
    });

    it('should handle errors without message property', () => {
      const error = {
        status: 422
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });

    it('should handle null errors', () => {
      const error = null;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });

    it('should handle undefined errors', () => {
      const error = undefined;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });

    it('should handle string errors', () => {
      const error = 'String error message';

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'String error message'
      });
    });

    it('should handle database connection errors', () => {
      const error = new Error('Connection to database failed');
      error.code = 'ECONNREFUSED';
      error.status = 503;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Connection to database failed'
      });
    });

    it('should handle validation errors', () => {
      const error = new Error('Validation failed');
      error.status = 400;
      error.details = ['Field is required', 'Invalid format'];

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Validation failed'
      });
    });

    it('should not call next() after handling error', () => {
      const error = new Error('Test error');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors with stack trace in development', () => {
      // Mock process.env.NODE_ENV to simulate development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Development error');
      error.stack = 'Error stack trace';

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Development error'
      });

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle errors with custom properties', () => {
      const error = new Error('Custom property error');
      error.status = 409;
      error.customProperty = 'custom value';

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Custom property error'
      });
    });
  });
}); 