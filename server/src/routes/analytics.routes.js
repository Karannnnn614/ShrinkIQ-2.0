import express from 'express';
import { 
  getUserAnalytics, 
  getClicksOverTime, 
  getDailyStats,
  getDeviceBreakdown,
  getLinkPerformance
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to get user-specific analytics data
router.get('/analytics', authenticate, getUserAnalytics);

// Route to get chart data for clicks over time
router.get('/chart', authenticate, getClicksOverTime);

// Route to get daily usage statistics
router.get('/daily', authenticate, getDailyStats);

// Route to get device breakdown
router.get('/devices', authenticate, getDeviceBreakdown);

// Route to get performance comparison of links
router.get('/performance', authenticate, getLinkPerformance);

export default router;