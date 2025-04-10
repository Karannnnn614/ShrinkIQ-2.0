import express from 'express';
import { getUserAnalytics, getClicksOverTime } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to get user-specific analytics data
router.get('/analytics', authenticate, getUserAnalytics);

// Route to get chart data for clicks over time
router.get('/chart', authenticate, getClicksOverTime);

export default router;