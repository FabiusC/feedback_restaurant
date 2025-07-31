import request from 'supertest';
import app from '../../src/app.js';
import { clearDatabase, seedTestData } from '../helpers/database.js';

describe('Reviews API', () => {
  let testData;

  beforeAll(async () => {
    await clearDatabase();
    testData = await seedTestData();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('POST /api/reviews', () => {
    it('should submit a valid review successfully', async () => {
      const reviewData = {
        idemployee: testData.employee1.id,
        ratespeedservice: 5,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'Excellent service and great food quality. Highly recommended!',
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.idemployee).toBe(reviewData.idemployee);
      expect(response.body.ratespeedservice).toBe(reviewData.ratespeedservice);
      expect(response.body.ratesatisfactionfood).toBe(reviewData.ratesatisfactionfood);
      expect(response.body.rateemployee).toBe(reviewData.rateemployee);
      expect(response.body.comment).toBe(reviewData.comment);
      expect(response.body.ispublic).toBe(reviewData.ispublic);
    });

    it('should submit a review without employee rating', async () => {
      const reviewData = {
        idemployee: testData.employee2.id,
        ratespeedservice: 4,
        ratesatisfactionfood: 5,
        comment: 'Great food and fast service. Will come back again!',
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.rateemployee).toBeNull();
    });

    it('should submit a private review', async () => {
      const reviewData = {
        idemployee: testData.employee1.id,
        ratespeedservice: 3,
        ratesatisfactionfood: 4,
        rateemployee: 3,
        comment: 'Service was okay but could be improved.',
        ispublic: false
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(201);

      expect(response.body.ispublic).toBe(false);
    });

    it('should reject review with invalid employee ID', async () => {
      const reviewData = {
        idemployee: 999,
        ratespeedservice: 5,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This should fail validation.',
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Employee ID must be a positive number');
    });

    it('should reject review with invalid speed service rating', async () => {
      const reviewData = {
        idemployee: testData.employee1.id,
        ratespeedservice: 6,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'This should fail validation.',
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Speed service rating must be a number between 1 and 5');
    });

    it('should reject review with invalid food satisfaction rating', async () => {
      const reviewData = {
        idemployee: testData.employee1.id,
        ratespeedservice: 4,
        ratesatisfactionfood: 0,
        rateemployee: 5,
        comment: 'This should fail validation.',
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Food satisfaction rating must be a number between 1 and 5');
    });

    it('should reject review with invalid employee rating', async () => {
      const reviewData = {
        idemployee: testData.employee1.id,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: -1,
        comment: 'This should fail validation.',
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Employee rating must be a number between 1 and 5');
    });

    it('should reject review with comment too short', async () => {
      const reviewData = {
        idemployee: testData.employee1.id,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: 'Short',
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Comment must be a string between 10 and 500 characters');
    });

    it('should reject review with comment too long', async () => {
      const longComment = 'a'.repeat(501);
      const reviewData = {
        idemployee: testData.employee1.id,
        ratespeedservice: 4,
        ratesatisfactionfood: 4,
        rateemployee: 5,
        comment: longComment,
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Comment must be a string between 10 and 500 characters');
    });

    it('should reject review with missing required fields', async () => {
      const reviewData = {
        idemployee: testData.employee1.id,
        // Missing ratespeedservice, ratesatisfactionfood, comment
        rateemployee: 5,
        ispublic: true
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/reviews/public', () => {
    it('should return only public reviews', async () => {
      const response = await request(app)
        .get('/api/reviews/public')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // All returned reviews should be public
      response.body.forEach(review => {
        expect(review.ispublic).toBe(true);
      });
    });

    it('should return reviews with all required fields', async () => {
      const response = await request(app)
        .get('/api/reviews/public')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      
      const review = response.body[0];
      expect(review).toHaveProperty('id');
      expect(review).toHaveProperty('idemployee');
      expect(review).toHaveProperty('ratespeedservice');
      expect(review).toHaveProperty('ratesatisfactionfood');
      expect(review).toHaveProperty('comment');
      expect(review).toHaveProperty('ispublic');
      expect(review).toHaveProperty('created_at');
    });
  });
}); 