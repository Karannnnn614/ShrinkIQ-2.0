// filepath: /url-shortener-api/url-shortener-api/src/routes/auth.routes.js
import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Login route
router.post('/login', login);

export default router;