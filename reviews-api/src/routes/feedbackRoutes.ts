import { Router } from "express";
import { FeedbackController } from "../controllers/FeedbackController";

const router = Router();
const feedbackController = new FeedbackController();

// POST /reviews - Submit a new review
router.post(
  "/reviews",
  feedbackController.submitReview.bind(feedbackController)
);

// GET /reviews/public - Get public reviews
router.get(
  "/reviews/public",
  feedbackController.getPublicReviews.bind(feedbackController)
);

export default router;
