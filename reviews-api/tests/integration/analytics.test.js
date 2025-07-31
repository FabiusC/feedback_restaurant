import request from 'supertest';
import app from '../../src/app.js';
import { clearDatabase, seedTestData } from '../helpers/database.js';

describe('Analytics API', () => {
  let testData;

  beforeAll(async () => {
    await clearDatabase();
    testData = await seedTestData();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('GET /api/analytics/employees/:id/stats', () => {
    it('should return employee statistics for a valid employee ID', async () => {
      const response = await request(app)
        .get(`/api/analytics/employees/${testData.employee1.id}/stats`)
        .expect(200);

      expect(response.body).toHaveProperty('employeeId');
      expect(response.body.employeeId).toBe(testData.employee1.id);
      expect(response.body).toHaveProperty('totalReviews');
      expect(response.body).toHaveProperty('averageSpeedService');
      expect(response.body).toHaveProperty('averageFoodSatisfaction');
      expect(response.body).toHaveProperty('averageEmployeeRating');
      expect(response.body).toHaveProperty('publicReviews');
      expect(response.body).toHaveProperty('privateReviews');
    });

    it('should return correct statistics for employee with reviews', async () => {
      const response = await request(app)
        .get(`/api/analytics/employees/${testData.employee1.id}/stats`)
        .expect(200);

      // Employee 1 has 2 reviews in test data
      expect(response.body.totalReviews).toBe(2);
      
      // Check that averages are numbers
      expect(typeof response.body.averageSpeedService).toBe('number');
      expect(typeof response.body.averageFoodSatisfaction).toBe('number');
      expect(typeof response.body.averageEmployeeRating).toBe('number');
      
      // Check that counts are numbers
      expect(typeof response.body.publicReviews).toBe('number');
      expect(typeof response.body.privateReviews).toBe('number');
      
      // Check that averages are within valid range (1-5)
      expect(response.body.averageSpeedService).toBeGreaterThanOrEqual(1);
      expect(response.body.averageSpeedService).toBeLessThanOrEqual(5);
      expect(response.body.averageFoodSatisfaction).toBeGreaterThanOrEqual(1);
      expect(response.body.averageFoodSatisfaction).toBeLessThanOrEqual(5);
      expect(response.body.averageEmployeeRating).toBeGreaterThanOrEqual(1);
      expect(response.body.averageEmployeeRating).toBeLessThanOrEqual(5);
    });

    it('should return statistics for employee with only public reviews', async () => {
      const response = await request(app)
        .get(`/api/analytics/employees/${testData.employee2.id}/stats`)
        .expect(200);

      expect(response.body.employeeId).toBe(testData.employee2.id);
      expect(response.body.totalReviews).toBe(1);
      expect(response.body.publicReviews).toBe(1);
      expect(response.body.privateReviews).toBe(0);
    });

    it('should handle employee with no reviews', async () => {
      // Create a new employee without any reviews
      const newEmployeeResponse = await request(app)
        .post('/api/employees')
        .send({
          name: 'No Reviews Employee',
          email: 'noreviews@test.com',
          isactive: true
        })
        .expect(201);

      const response = await request(app)
        .get(`/api/analytics/employees/${newEmployeeResponse.body.id}/stats`)
        .expect(200);

      expect(response.body.employeeId).toBe(newEmployeeResponse.body.id);
      expect(response.body.totalReviews).toBe(0);
      expect(response.body.publicReviews).toBe(0);
      expect(response.body.privateReviews).toBe(0);
      
      // Averages should be 0 or null when no reviews exist
      expect(response.body.averageSpeedService).toBe(0);
      expect(response.body.averageFoodSatisfaction).toBe(0);
      expect(response.body.averageEmployeeRating).toBe(0);
    });

    it('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .get('/api/analytics/employees/999/stats')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for invalid employee ID', async () => {
      const response = await request(app)
        .get('/api/analytics/employees/invalid/stats')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should calculate correct averages for multiple reviews', async () => {
      // Add more reviews to employee 1 to test average calculations
      await request(app)
        .post('/api/reviews')
        .send({
          idemployee: testData.employee1.id,
          ratespeedservice: 5,
          ratesatisfactionfood: 5,
          rateemployee: 5,
          comment: 'Perfect service and excellent food quality!',
          ispublic: true
        })
        .expect(201);

      await request(app)
        .post('/api/reviews')
        .send({
          idemployee: testData.employee1.id,
          ratespeedservice: 1,
          ratesatisfactionfood: 2,
          rateemployee: 3,
          comment: 'Poor service and disappointing food.',
          ispublic: true
        })
        .expect(201);

      const response = await request(app)
        .get(`/api/analytics/employees/${testData.employee1.id}/stats`)
        .expect(200);

      // Now employee 1 should have 4 total reviews
      expect(response.body.totalReviews).toBe(4);
      
      // Check that averages are calculated correctly
      // Speed service: 4, 5, 1 = average of 3.33...
      expect(response.body.averageSpeedService).toBeCloseTo(3.33, 1);
      
      // Food satisfaction: 5, 4, 5, 2 = average of 4
      expect(response.body.averageFoodSatisfaction).toBeCloseTo(4, 1);
      
      // Employee rating: 4, null, 5, 3 = average of 4
      expect(response.body.averageEmployeeRating).toBeCloseTo(4, 1);
    });

    it('should handle employee ratings that are null', async () => {
      // Add a review without employee rating
      await request(app)
        .post('/api/reviews')
        .send({
          idemployee: testData.employee2.id,
          ratespeedservice: 3,
          ratesatisfactionfood: 4,
          comment: 'Good food but no specific employee interaction.',
          ispublic: true
        })
        .expect(201);

      const response = await request(app)
        .get(`/api/analytics/employees/${testData.employee2.id}/stats`)
        .expect(200);

      expect(response.body.totalReviews).toBe(2);
      // Should still calculate average for non-null employee ratings
      expect(typeof response.body.averageEmployeeRating).toBe('number');
    });
  });
}); 