import { validateReview } from '../../../src/middleware/validation.js';

describe('Validation Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validateReview', () => {
    it('should pass validation for valid review data', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 5,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should pass validation without employee rating', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 5,
        comment: 'This is a valid comment without employee rating.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should reject invalid employee ID (negative)', () => {
      mockReq.body = {
        idemployee: -1,
        ratespeedservice: 5,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Employee ID must be a positive number.'
      });
    });

    it('should reject invalid employee ID (zero)', () => {
      mockReq.body = {
        idemployee: 0,
        ratespeedservice: 5,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Employee ID must be a positive number.'
      });
    });

    it('should reject invalid employee ID (string)', () => {
      mockReq.body = {
        idemployee: 'invalid',
        ratespeedservice: 5,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Employee ID must be a positive number.'
      });
    });

    it('should reject invalid speed service rating (too high)', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 6,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Speed service rating must be a number between 1 and 5.'
      });
    });

    it('should reject invalid speed service rating (too low)', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 0,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Speed service rating must be a number between 1 and 5.'
      });
    });

    it('should reject invalid speed service rating (string)', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 'high',
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Speed service rating must be a number between 1 and 5.'
      });
    });

    it('should reject invalid food satisfaction rating (too high)', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 7,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Food satisfaction rating must be a number between 1 and 5.'
      });
    });

    it('should reject invalid food satisfaction rating (too low)', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: -1,
        rateemployee: 5,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Food satisfaction rating must be a number between 1 and 5.'
      });
    });

    it('should reject invalid employee rating (too high)', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 6,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Employee rating must be a number between 1 and 5.'
      });
    });

    it('should reject invalid employee rating (too low)', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 0,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Employee rating must be a number between 1 and 5.'
      });
    });

    it('should accept null employee rating', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: null,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should accept undefined employee rating', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: undefined,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should reject comment that is too short', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'Short'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Comment must be a string between 10 and 500 characters.'
      });
    });

    it('should reject comment that is too long', () => {
      const longComment = 'a'.repeat(501);
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: longComment
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Comment must be a string between 10 and 500 characters.'
      });
    });

    it('should reject comment that is not a string', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 12345
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Comment must be a string between 10 and 500 characters.'
      });
    });

    it('should accept comment with exactly 10 characters', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: '1234567890'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should accept comment with exactly 500 characters', () => {
      const exactComment = 'a'.repeat(500);
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: exactComment
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should accept valid ratings at boundary values', () => {
      mockReq.body = {
        idemployee: 1,
        ratespeedservice: 1,
        ratesatisfactionfood: 5,
        rateemployee: 3,
        comment: 'This is a valid comment with more than 10 characters.'
      };

      validateReview(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
}); 