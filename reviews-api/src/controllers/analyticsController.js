import analyticsService from '../services/analyticsService.js';

export const getEmployeeStats = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        const stats = await analyticsService.calculateEmployeeStats(employeeId);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};