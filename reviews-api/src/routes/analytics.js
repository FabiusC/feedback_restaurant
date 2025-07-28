import express from 'express';
import { getEmployeeStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/employees/:id/stats', getEmployeeStats);

export default router;