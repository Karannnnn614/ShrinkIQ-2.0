// filepath: /url-shortener-api/url-shortener-api/src/routes/auth.routes.js
import express from 'express';
import { login, register, getUserProfile, updateUserProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Register route
router.post('/register', register);

// Get user profile
router.get('/profile', authenticate, getUserProfile);

// Update user profile
router.put('/profile', authenticate, updateUserProfile);

export default router;