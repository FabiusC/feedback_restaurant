const db = require('../config/database');

const reviewsService = {
    submitReview: async (reviewData) => {
        const { rating, comment } = reviewData;
        const query = 'INSERT INTO review (rating, comment, date) VALUES ($1, $2, NOW()) RETURNING *';
        const values = [rating, comment];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error submitting review: ' + error.message);
        }
    },

    getPublicReviews: async () => {
        const query = 'SELECT * FROM review WHERE ispublic = true ORDER BY date DESC';

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching public reviews: ' + error.message);
        }
    }
};

module.exports = reviewsService;