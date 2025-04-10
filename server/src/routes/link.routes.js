// filepath: /url-shortener-api/url-shortener-api/src/routes/link.routes.js
import express from 'express';
import { 
  createShortLink, 
  redirectToOriginalUrl, 
  getUserLinks, 
  getLinkStats, 
  updateLink, 
  deleteLink
} from '../controllers/link.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to create a short link
router.post('/shorten', authenticate, createShortLink);

// Route to get all links for the current user
router.get('/', authenticate, getUserLinks);

// Route to get statistics for a specific link
router.get('/:id/stats', authenticate, getLinkStats);

// Route to update a link
router.put('/:id', authenticate, updateLink);

// Route to delete a link
router.delete('/:id', authenticate, deleteLink);

// Route to redirect to the original URL
router.get('/:shortUrl', redirectToOriginalUrl); // <== This line is crucial

export default router;