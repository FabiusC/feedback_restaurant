import pool from '../config/database.js';
import Review from '../models/Review.js';

export const submitReview = async (req, res) => {
    const { idemployee, ratespeedservice, ratesatisfactionfood, rateemployee, comment, ispublic = true } = req.body;

    try {
        console.log('Received review data:', req.body);
        const result = await pool.query(Review.insertReviewQuery(),
            [idemployee, ratespeedservice, ratesatisfactionfood, rateemployee, comment, ispublic]
        );
        const newReview = result.rows[0];
        return res.status(201).json(newReview);
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getPublicReviews = async (req, res) => {
    try {
        const result = await pool.query(Review.getPublicReviewsQuery());
        const reviews = result.rows;
        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching public reviews:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};