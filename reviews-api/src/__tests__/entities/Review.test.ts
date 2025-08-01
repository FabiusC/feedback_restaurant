import { Review } from '../../entities/Review';

describe('Review Entity', () => {
  describe('Constructor and Getters', () => {
    it('should create a review with valid data', () => {
      // Arrange & Act
      const review = new Review(1, 4, 5, 1, 4, 'Great service!', true);

      // Assert
      expect(review.getId()).toBe(1);
      expect(review.getSpeedRating()).toBe(4);
      expect(review.getFoodRating()).toBe(5);
      expect(review.getIdEmployeeSelected()).toBe(1);
      expect(review.getEmployeeRating()).toBe(4);
      expect(review.getComment()).toBe('Great service!');
      expect(review.getIsPublic()).toBe(true);
    });

    it('should create a review without employee data', () => {
      // Arrange & Act
      const review = new Review(1, 4, 5, null, null, 'Great food!', false);

      // Assert
      expect(review.getId()).toBe(1);
      expect(review.getSpeedRating()).toBe(4);
      expect(review.getFoodRating()).toBe(5);
      expect(review.getIdEmployeeSelected()).toBeNull();
      expect(review.getEmployeeRating()).toBeNull();
      expect(review.getComment()).toBe('Great food!');
      expect(review.getIsPublic()).toBe(false);
    });
  });

  describe('getAverageRating', () => {
    it('should calculate average rating with all ratings present', () => {
      // Arrange
      const review = new Review(1, 4, 5, 1, 3, 'Good service', true);

      // Act
      const average = review.getAverageRating();

      // Assert
      expect(average).toBe(4); // (4 + 5 + 3) / 3 = 4
    });

    it('should calculate average rating without employee rating', () => {
      // Arrange
      const review = new Review(1, 4, 5, null, null, 'Good food', true);

      // Act
      const average = review.getAverageRating();

      // Assert
      expect(average).toBe(4.5); // (4 + 5) / 2 = 4.5
    });

    it('should handle decimal averages correctly', () => {
      // Arrange
      const review = new Review(1, 3, 4, 1, 5, 'Mixed experience', true);

      // Act
      const average = review.getAverageRating();

      // Assert
      expect(average).toBe(4); // (3 + 4 + 5) / 3 = 4
    });
  });

  describe('validate', () => {
    it('should return true for valid review data', () => {
      // Arrange
      const review = new Review(1, 4, 5, 1, 4, 'Great service!', true);

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should return true for valid review without employee', () => {
      // Arrange
      const review = new Review(1, 4, 5, null, null, 'Great food!', true);

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should return false when speed rating is invalid', () => {
      // Arrange
      const review = new Review(1, 6, 5, 1, 4, 'Great service!', true); // Speed rating > 5

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when food rating is invalid', () => {
      // Arrange
      const review = new Review(1, 4, -1, 1, 4, 'Great service!', true); // Food rating < 0

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when employee rating is invalid', () => {
      // Arrange
      const review = new Review(1, 4, 5, 1, 7, 'Great service!', true); // Employee rating > 5

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when comment is too long', () => {
      // Arrange
      const longComment = 'A'.repeat(1001); // Comment > 1000 characters
      const review = new Review(1, 4, 5, 1, 4, longComment, true);

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when comment is empty', () => {
      // Arrange
      const review = new Review(1, 4, 5, 1, 4, '', true);

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when employee is selected but no employee rating', () => {
      // Arrange
      const review = new Review(1, 4, 5, 1, null, 'Great service!', true);

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when employee rating is provided but no employee selected', () => {
      // Arrange
      const review = new Review(1, 4, 5, null, 4, 'Great service!', true);

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(false);
    });
  });

  describe('Setters', () => {
    it('should update review properties correctly', () => {
      // Arrange
      const review = new Review(1, 3, 4, 1, 3, 'Initial comment', true);

      // Act
      review.setSpeedRating(5);
      review.setFoodRating(5);
      review.setEmployeeRating(5);
      review.setComment('Updated comment');
      review.setIsPublic(false);

      // Assert
      expect(review.getSpeedRating()).toBe(5);
      expect(review.getFoodRating()).toBe(5);
      expect(review.getEmployeeRating()).toBe(5);
      expect(review.getComment()).toBe('Updated comment');
      expect(review.getIsPublic()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid ratings', () => {
      // Arrange
      const review = new Review(1, 1, 1, 1, 1, 'Minimum ratings', true);

      // Act
      const isValid = review.validate();
      const average = review.getAverageRating();

      // Assert
      expect(isValid).toBe(true);
      expect(average).toBe(1);
    });

    it('should handle maximum valid ratings', () => {
      // Arrange
      const review = new Review(1, 5, 5, 1, 5, 'Maximum ratings', true);

      // Act
      const isValid = review.validate();
      const average = review.getAverageRating();

      // Assert
      expect(isValid).toBe(true);
      expect(average).toBe(5);
    });

    it('should handle comment with exactly 1000 characters', () => {
      // Arrange
      const comment = 'A'.repeat(1000);
      const review = new Review(1, 4, 5, 1, 4, comment, true);

      // Act
      const isValid = review.validate();

      // Assert
      expect(isValid).toBe(true);
    });
  });
}); 