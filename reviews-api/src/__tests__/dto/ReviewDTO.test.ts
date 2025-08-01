import { ReviewDTO } from '../../dto/ReviewDTO';

describe('ReviewDTO', () => {
  describe('Constructor and Getters', () => {
    it('should create a DTO with valid data', () => {
      // Arrange & Act
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Assert
      expect(dto.getSpeedRating()).toBe(4);
      expect(dto.getFoodRating()).toBe(5);
      expect(dto.getIdEmployeeSelected()).toBe(1);
      expect(dto.getEmployeeRating()).toBe(4);
      expect(dto.getComment()).toBe('Great service!');
      expect(dto.getIsPublic()).toBe(true);
    });

    it('should create a DTO without employee data', () => {
      // Arrange & Act
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(null);
      dto.setEmployeeRating(null);
      dto.setComment('Great food!');
      dto.setIsPublic(false);

      // Assert
      expect(dto.getSpeedRating()).toBe(4);
      expect(dto.getFoodRating()).toBe(5);
      expect(dto.getIdEmployeeSelected()).toBeNull();
      expect(dto.getEmployeeRating()).toBeNull();
      expect(dto.getComment()).toBe('Great food!');
      expect(dto.getIsPublic()).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return true for valid DTO data', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should return true for valid DTO without employee', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(null);
      dto.setEmployeeRating(null);
      dto.setComment('Great food!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should return false when speed rating is missing', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when food rating is missing', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when speed rating is invalid', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(6); // > 5
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when food rating is invalid', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(-1); // < 0
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when employee rating is invalid', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(7); // > 5
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when comment is missing', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when comment is empty', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when comment is too long', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('A'.repeat(1001)); // > 1000 characters
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when employee is selected but no employee rating', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(null);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when employee rating is provided but no employee selected', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(null);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });

    it('should return false when isPublic is undefined', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('Great service!');
      // isPublic not set

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(false);
    });
  });

  describe('Setters', () => {
    it('should update DTO properties correctly', () => {
      // Arrange
      const dto = new ReviewDTO();

      // Act
      dto.setSpeedRating(3);
      dto.setFoodRating(4);
      dto.setIdEmployeeSelected(2);
      dto.setEmployeeRating(3);
      dto.setComment('Updated comment');
      dto.setIsPublic(false);

      // Assert
      expect(dto.getSpeedRating()).toBe(3);
      expect(dto.getFoodRating()).toBe(4);
      expect(dto.getIdEmployeeSelected()).toBe(2);
      expect(dto.getEmployeeRating()).toBe(3);
      expect(dto.getComment()).toBe('Updated comment');
      expect(dto.getIsPublic()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid ratings', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(1);
      dto.setFoodRating(1);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(1);
      dto.setComment('Minimum ratings');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should handle maximum valid ratings', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(5);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(5);
      dto.setComment('Maximum ratings');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should handle comment with exactly 1000 characters', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(1);
      dto.setEmployeeRating(4);
      dto.setComment('A'.repeat(1000));
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should handle null values for optional fields', () => {
      // Arrange
      const dto = new ReviewDTO();
      dto.setSpeedRating(4);
      dto.setFoodRating(5);
      dto.setIdEmployeeSelected(null);
      dto.setEmployeeRating(null);
      dto.setComment('Valid comment');
      dto.setIsPublic(true);

      // Act
      const isValid = dto.validate();

      // Assert
      expect(isValid).toBe(true);
      expect(dto.getIdEmployeeSelected()).toBeNull();
      expect(dto.getEmployeeRating()).toBeNull();
    });
  });
}); 