// filepath: /url-shortener-api/url-shortener-api/src/routes/link.routes.js
import express from 'express';
import { createShortLink, redirectToOriginalUrl } from '../controllers/link.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to create a short link
router.post('/shorten', authenticate, createShortLink);

// Route to redirect to the original URL
router.get('/:shortUrl', redirectToOriginalUrl); // <== This line is crucial

export default router;