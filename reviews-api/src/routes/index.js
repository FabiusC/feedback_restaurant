import express from 'express';
import reviewsRoutes from './reviews.js';
import analyticsRoutes from './analytics.js';
import employeeRoutes from './employees.js';

const router = express.Router();

// API Documentation Route
router.get('/', (req, res) => {
    const format = req.query.format;

    if (format === 'html') {
        const htmlDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback Restaurant API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .method {
            font-weight: bold;
            color: #e74c3c;
        }
        .url {
            font-family: monospace;
            background: #ecf0f1;
            padding: 5px 10px;
            border-radius: 3px;
            color: #2c3e50;
        }
        .description {
            color: #7f8c8d;
            margin: 10px 0;
        }
        .example {
            background: #e8f5e8;
            border: 1px solid #27ae60;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .example h4 {
            color: #27ae60;
            margin-top: 0;
        }
        pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .json-view {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍽️ Feedback Restaurant API</h1>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Description:</strong> A RESTful API for managing restaurant reviews, employee analytics, and employee management</p>
        
        <h2>📋 Available Endpoints</h2>
        
        <h3>📝 Reviews</h3>
        
        <div class="endpoint">
            <div class="method">POST</div>
            <div class="url">/api/reviews/reviews</div>
            <div class="description">Submit a new restaurant review</div>
            <div class="json-view">
                <strong>Body Parameters:</strong><br>
                • idemployee: number (optional)<br>
                • ratespeedservice: number (1-5)<br>
                • ratesatisfactionfood: number (1-5)<br>
                • rateemployee: number (1-5, required if idemployee provided)<br>
                • comment: string (10-500 characters)<br>
                • ispublic: boolean (default: true)
            </div>
        </div>
        
        <div class="endpoint">
            <div class="method">GET</div>
            <div class="url">/api/reviews/reviews/public</div>
            <div class="description">Retrieve all public reviews</div>
        </div>
        
        <h3>👥 Employees</h3>
        
        <div class="endpoint">
            <div class="method">GET</div>
            <div class="url">/api/employees/employees</div>
            <div class="description">Get all active employees</div>
        </div>
        
        <div class="endpoint">
            <div class="method">GET</div>
            <div class="url">/api/employees/employees/:id</div>
            <div class="description">Get employee by ID</div>
        </div>
        
        <div class="endpoint">
            <div class="method">POST</div>
            <div class="url">/api/employees/employees</div>
            <div class="description">Create a new employee</div>
            <div class="json-view">
                <strong>Body Parameters:</strong><br>
                • name: string (required)<br>
                • email: string (required, valid email format)<br>
                • isactive: boolean (default: true)
            </div>
        </div>
        
        <div class="endpoint">
            <div class="method">PUT</div>
            <div class="url">/api/employees/employees/:id</div>
            <div class="description">Update an employee</div>
        </div>
        
        <div class="endpoint">
            <div class="method">DELETE</div>
            <div class="url">/api/employees/employees/:id</div>
            <div class="description">Deactivate an employee (soft delete)</div>
        </div>
        
        <h3>📊 Analytics</h3>
        
        <div class="endpoint">
            <div class="method">GET</div>
            <div class="url">/api/analytics/employees/:id/stats</div>
            <div class="description">Get performance statistics for a specific employee</div>
            <div class="json-view">
                <strong>Parameters:</strong><br>
                • id: Employee ID (number)
            </div>
        </div>
        
        <h2>💡 Usage Examples</h2>
        
        <div class="example">
            <h4>Submit a Review</h4>
            <pre><code>curl -X POST http://localhost:3000/api/reviews/reviews \\
  -H "Content-Type: application/json" \\
  -d '{
    "idemployee": 1,
    "ratespeedservice": 5,
    "ratesatisfactionfood": 4,
    "rateemployee": 5,
    "comment": "Excellent service and delicious food!",
    "ispublic": true
  }'</code></pre>
        </div>
        
        <div class="example">
            <h4>Get All Employees</h4>
            <pre><code>curl http://localhost:3000/api/employees/employees</code></pre>
        </div>
        
        <div class="example">
            <h4>Create New Employee</h4>
            <pre><code>curl -X POST http://localhost:3000/api/employees/employees \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john.doe@restaurant.com",
    "isactive": true
  }'</code></pre>
        </div>
        
        <div class="example">
            <h4>Get Employee Statistics</h4>
            <pre><code>curl http://localhost:3000/api/analytics/employees/1/stats</code></pre>
        </div>
        
        <h2>🔗 Quick Links</h2>
        <ul>
            <li><a href="/api/reviews/reviews/public" target="_blank">View Public Reviews</a></li>
            <li><a href="/api/employees/employees" target="_blank">View All Employees</a></li>
            <li><a href="/api/analytics/employees/1/stats" target="_blank">Employee 1 Stats</a></li>
            <li><a href="/api?format=json" target="_blank">JSON API Documentation</a></li>
        </ul>
    </div>
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html');
        res.send(htmlDoc);
    } else {
        const apiDocs = {
            message: 'Feedback Restaurant API',
            version: '1.0.0',
            description: 'A RESTful API for managing restaurant reviews, employee analytics, and employee management',
            endpoints: {
                reviews: {
                    'POST /reviews/reviews': {
                        description: 'Submit a new restaurant review',
                        body: {
                            idemployee: 'number (optional)',
                            ratespeedservice: 'number (1-5)',
                            ratesatisfactionfood: 'number (1-5)',
                            rateemployee: 'number (1-5, required if idemployee provided)',
                            comment: 'string (10-500 characters)',
                            ispublic: 'boolean (default: true)'
                        }
                    },
                    'GET /reviews/reviews/public': {
                        description: 'Retrieve all public reviews',
                        response: 'Array of public review objects'
                    }
                },
                employees: {
                    'GET /employees/employees': {
                        description: 'Get all active employees',
                        response: 'Array of employee objects'
                    },
                    'GET /employees/employees/:id': {
                        description: 'Get employee by ID',
                        parameters: {
                            id: 'Employee ID (number)'
                        },
                        response: 'Employee object'
                    },
                    'POST /employees/employees': {
                        description: 'Create a new employee',
                        body: {
                            name: 'string (required)',
                            email: 'string (required, valid email format)',
                            isactive: 'boolean (default: true)'
                        }
                    },
                    'PUT /employees/employees/:id': {
                        description: 'Update an employee',
                        parameters: {
                            id: 'Employee ID (number)'
                        }
                    },
                    'DELETE /employees/employees/:id': {
                        description: 'Deactivate an employee (soft delete)',
                        parameters: {
                            id: 'Employee ID (number)'
                        }
                    }
                },
                analytics: {
                    'GET /analytics/employees/:id/stats': {
                        description: 'Get performance statistics for a specific employee',
                        parameters: {
                            id: 'Employee ID (number)'
                        },
                        response: 'Employee performance metrics object'
                    }
                }
            },
            examples: {
                submitReview: {
                    method: 'POST',
                    url: '/reviews/reviews',
                    body: {
                        idemployee: 1,
                        ratespeedservice: 5,
                        ratesatisfactionfood: 4,
                        rateemployee: 5,
                        comment: 'Excellent service and delicious food!',
                        ispublic: true
                    }
                },
                getEmployees: {
                    method: 'GET',
                    url: '/employees/employees'
                },
                createEmployee: {
                    method: 'POST',
                    url: '/employees/employees',
                    body: {
                        name: 'John Doe',
                        email: 'john.doe@restaurant.com',
                        isactive: true
                    }
                },
                getEmployeeStats: {
                    method: 'GET',
                    url: '/analytics/employees/1/stats'
                }
            }
        };

        res.json(apiDocs);
    }
});

const setupRoutes = (app) => {
    app.use('/api', router);
    app.use('/api/reviews', reviewsRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use('/api/analytics', analyticsRoutes);
};

export default setupRoutes;