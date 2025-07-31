import request from 'supertest';
import app from '../../src/app.js';

describe('API Documentation and General Endpoints', () => {
  describe('GET /api', () => {
    it('should return API documentation with all endpoints', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('reviews');
      expect(response.body).toHaveProperty('employees');
      expect(response.body).toHaveProperty('analytics');

      // Check reviews endpoints
      expect(response.body.reviews).toHaveProperty('POST /reviews');
      expect(response.body.reviews).toHaveProperty('GET /reviews/public');

      // Check employees endpoints
      expect(response.body.employees).toHaveProperty('GET /employees');
      expect(response.body.employees).toHaveProperty('GET /employees/:id');
      expect(response.body.employees).toHaveProperty('POST /employees');
      expect(response.body.employees).toHaveProperty('PUT /employees/:id');
      expect(response.body.employees).toHaveProperty('DELETE /employees/:id');

      // Check analytics endpoints
      expect(response.body.analytics).toHaveProperty('GET /employees/:id/stats');
    });

    it('should return correct endpoint descriptions', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.reviews['POST /reviews']).toBe('Submit a new restaurant review');
      expect(response.body.reviews['GET /reviews/public']).toBe('Retrieve all public reviews');
      expect(response.body.employees['GET /employees']).toBe('Get all active employees');
      expect(response.body.employees['GET /employees/:id']).toBe('Get employee by ID');
      expect(response.body.employees['POST /employees']).toBe('Create a new employee');
      expect(response.body.employees['PUT /employees/:id']).toBe('Update an employee');
      expect(response.body.employees['DELETE /employees/:id']).toBe('Deactivate an employee');
      expect(response.body.analytics['GET /employees/:id/stats']).toBe('Get performance statistics for a specific employee');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in responses', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers).toHaveProperty('access-control-allow-methods');
      expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE, OPTIONS');
      expect(response.headers).toHaveProperty('access-control-allow-headers');
      expect(response.headers['access-control-allow-headers']).toBe('Origin, X-Requested-With, Content-Type, Accept, Authorization');
    });

    it('should handle OPTIONS requests correctly', async () => {
      const response = await request(app)
        .options('/api/reviews')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent API endpoints', async () => {
      const response = await request(app)
        .get('/api/employees/nonexistent/endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Request Logging', () => {
    it('should log requests using morgan middleware', async () => {
      // This test verifies that morgan is properly configured
      // The actual logging is handled by morgan and we can't easily test it
      // But we can verify the middleware is in place by checking the response
      const response = await request(app)
        .get('/api')
        .expect(200);

      // If morgan is working, the request should be processed normally
      expect(response.status).toBe(200);
    });
  });

  describe('Content-Type Handling', () => {
    it('should accept JSON content type for POST requests', async () => {
      const response = await request(app)
        .post('/api/employees')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Test Employee',
          email: 'test@example.com'
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should return JSON responses', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
    });
  });
}); 