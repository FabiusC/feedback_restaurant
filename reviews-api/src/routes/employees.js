import express from 'express';
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

// Get all employees
router.get('/employees', getAllEmployees);

// Get employee by ID
router.get('/employees/:id', getEmployeeById);

// Create new employee
router.post('/employees', createEmployee);

// Update employee
router.put('/employees/:id', updateEmployee);

// Delete employee (soft delete - sets isactive to false)
router.delete('/employees/:id', deleteEmployee);

export default router; 