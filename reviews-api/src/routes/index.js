import express from 'express';
import reviewsRoutes from './reviews.js';
import analyticsRoutes from './analytics.js';
import employeeRoutes from './employees.js';

const router = express.Router();

// API Documentation Route
router.get('/', (req, res) => {
    const endpoints = {
        reviews: {
            'POST /reviews': 'Submit a new restaurant review',
            'GET /reviews/public': 'Retrieve all public reviews'
        },
        employees: {
            'GET /employees': 'Get all active employees',
            'GET /employees/:id': 'Get employee by ID',
            'POST /employees': 'Create a new employee',
            'PUT /employees/:id': 'Update an employee',
            'DELETE /employees/:id': 'Deactivate an employee'
        },
        analytics: {
            'GET /employees/:id/stats': 'Get performance statistics for a specific employee'
        }
    };

    res.json(endpoints);
});

const setupRoutes = (app) => {
    app.use('/api', router);
    app.use('/api/reviews', reviewsRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use('/api/analytics', analyticsRoutes);
};

export default setupRoutes;