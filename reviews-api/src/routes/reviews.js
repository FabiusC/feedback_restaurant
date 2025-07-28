import express from 'express';
import { submitReview, getPublicReviews } from '../controllers/reviewsController.js';
import validateReview from '../middleware/validation.js';

const router = express.Router();

router.post('/reviews', validateReview, submitReview);
router.get('/reviews/public', getPublicReviews);

export default router;