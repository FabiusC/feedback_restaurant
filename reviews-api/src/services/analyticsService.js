import pool from '../config/database.js';

const analyticsService = {
    calculateEmployeeStats: async (employeeId) => {
        const query = `
            SELECT 
                AVG(rateemployee) AS averageEmployeeRating,
                AVG(ratespeedservice) AS averageSpeedService,
                AVG(ratesatisfactionfood) AS averageFoodSatisfaction,
                COUNT(*) AS reviewCount
            FROM review
            WHERE idemployee = $1 AND rateemployee IS NOT NULL
        `;
        const values = [employeeId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error retrieving employee statistics');
        }
    }
};

export default analyticsService;