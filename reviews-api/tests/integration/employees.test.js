import request from 'supertest';
import app from '../../src/app.js';
import { clearDatabase, seedTestData } from '../helpers/database.js';

describe('Employees API', () => {
    let testData;

    beforeAll(async () => {
        await clearDatabase();
        testData = await seedTestData();
    });

    afterAll(async () => {
        await clearDatabase();
    });

    describe('GET /api/employees', () => {
        it('should return all active employees', async () => {
            const response = await request(app)
                .get('/api/employees')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            // All returned employees should be active
            response.body.forEach(employee => {
                expect(employee.isactive).toBe(true);
            });
        });

        it('should return employees with all required fields', async () => {
            const response = await request(app)
                .get('/api/employees')
                .expect(200);

            expect(response.body.length).toBeGreaterThan(0);

            const employee = response.body[0];
            expect(employee).toHaveProperty('id');
            expect(employee).toHaveProperty('name');
            expect(employee).toHaveProperty('email');
            expect(employee).toHaveProperty('isactive');
            expect(employee).toHaveProperty('created_at');
        });
    });

    describe('GET /api/employees/:id', () => {
        it('should return a specific employee by ID', async () => {
            const response = await request(app)
                .get(`/api/employees/${testData.employee1.id}`)
                .expect(200);

            expect(response.body.id).toBe(testData.employee1.id);
            expect(response.body.name).toBe(testData.employee1.name);
            expect(response.body.email).toBe(testData.employee1.email);
            expect(response.body.isactive).toBe(testData.employee1.isactive);
        });

        it('should return 404 for non-existent employee', async () => {
            const response = await request(app)
                .get('/api/employees/999')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Employee not found');
        });

        it('should return 404 for invalid employee ID', async () => {
            const response = await request(app)
                .get('/api/employees/invalid')
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/employees', () => {
        it('should create a new employee successfully', async () => {
            const employeeData = {
                name: 'Alice Johnson',
                email: 'alice@test.com',
                isactive: true
            };

            const response = await request(app)
                .post('/api/employees')
                .send(employeeData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(employeeData.name);
            expect(response.body.email).toBe(employeeData.email);
            expect(response.body.isactive).toBe(employeeData.isactive);
        });

        it('should create employee with default isactive value', async () => {
            const employeeData = {
                name: 'Bob Wilson',
                email: 'bob@test.com'
                // isactive not provided, should default to true
            };

            const response = await request(app)
                .post('/api/employees')
                .send(employeeData)
                .expect(201);

            expect(response.body.isactive).toBe(true);
        });

        it('should reject employee creation without name', async () => {
            const employeeData = {
                email: 'test@test.com',
                isactive: true
            };

            const response = await request(app)
                .post('/api/employees')
                .send(employeeData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Name and email are required');
        });

        it('should reject employee creation without email', async () => {
            const employeeData = {
                name: 'Test Employee',
                isactive: true
            };

            const response = await request(app)
                .post('/api/employees')
                .send(employeeData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Name and email are required');
        });

        it('should reject employee creation with invalid email format', async () => {
            const employeeData = {
                name: 'Test Employee',
                email: 'invalid-email',
                isactive: true
            };

            const response = await request(app)
                .post('/api/employees')
                .send(employeeData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Invalid email format');
        });

        it('should reject employee creation with empty name', async () => {
            const employeeData = {
                name: '',
                email: 'test@test.com',
                isactive: true
            };

            const response = await request(app)
                .post('/api/employees')
                .send(employeeData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Name and email are required');
        });

        it('should reject employee creation with empty email', async () => {
            const employeeData = {
                name: 'Test Employee',
                email: '',
                isactive: true
            };

            const response = await request(app)
                .post('/api/employees')
                .send(employeeData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Name and email are required');
        });
    });

    describe('PUT /api/employees/:id', () => {
        it('should update an existing employee successfully', async () => {
            const updateData = {
                name: 'Updated John Doe',
                email: 'updated.john@test.com',
                isactive: true
            };

            const response = await request(app)
                .put(`/api/employees/${testData.employee1.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body.id).toBe(testData.employee1.id);
            expect(response.body.name).toBe(updateData.name);
            expect(response.body.email).toBe(updateData.email);
            expect(response.body.isactive).toBe(updateData.isactive);
        });

        it('should update employee with partial data', async () => {
            const updateData = {
                name: 'Partially Updated Jane'
                // Only updating name, email and isactive should remain unchanged
            };

            const response = await request(app)
                .put(`/api/employees/${testData.employee2.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body.id).toBe(testData.employee2.id);
            expect(response.body.name).toBe(updateData.name);
            expect(response.body.email).toBe(testData.employee2.email);
            expect(response.body.isactive).toBe(testData.employee2.isactive);
        });

        it('should reject update with invalid email format', async () => {
            const updateData = {
                name: 'Test Employee',
                email: 'invalid-email-format',
                isactive: true
            };

            const response = await request(app)
                .put(`/api/employees/${testData.employee1.id}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Invalid email format');
        });

        it('should return 404 when updating non-existent employee', async () => {
            const updateData = {
                name: 'Non-existent Employee',
                email: 'nonexistent@test.com',
                isactive: true
            };

            const response = await request(app)
                .put('/api/employees/999')
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Employee not found');
        });
    });

    describe('DELETE /api/employees/:id', () => {
        it('should deactivate an existing employee successfully', async () => {
            const response = await request(app)
                .delete(`/api/employees/${testData.employee1.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Employee deactivated successfully');
            expect(response.body).toHaveProperty('employee');
            expect(response.body.employee.isactive).toBe(false);
        });

        it('should return 404 when deactivating non-existent employee', async () => {
            const response = await request(app)
                .delete('/api/employees/999')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Employee not found');
        });

        it('should return 404 for invalid employee ID', async () => {
            const response = await request(app)
                .delete('/api/employees/invalid')
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });
    });
}); 