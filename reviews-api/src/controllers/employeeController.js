import pool from '../config/database.js';
import Employee from '../models/Employee.js';

export const getAllEmployees = async (req, res) => {
    try {
        const result = await pool.query(Employee.getAllEmployeesQuery());
        const employees = result.rows;
        return res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(Employee.getEmployeeByIdQuery(), [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employee = result.rows[0];
        return res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createEmployee = async (req, res) => {
    try {
        const { name, email, isactive = true } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Email validation
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const result = await pool.query(Employee.createEmployeeQuery(), [name, email, isactive]);
        const newEmployee = result.rows[0];
        return res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isactive } = req.body;

        // Check if employee exists
        const existingEmployee = await pool.query(Employee.getEmployeeByIdQuery(), [id]);
        if (existingEmployee.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Email validation if provided
        if (email) {
            const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
        }

        const result = await pool.query(Employee.updateEmployeeQuery(), [id, name, email, isactive]);
        const updatedEmployee = result.rows[0];
        return res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const existingEmployee = await pool.query(Employee.getEmployeeByIdQuery(), [id]);
        if (existingEmployee.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const result = await pool.query(Employee.deleteEmployeeQuery(), [id]);
        const deletedEmployee = result.rows[0];
        return res.status(200).json({ message: 'Employee deactivated successfully', employee: deletedEmployee });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}; 