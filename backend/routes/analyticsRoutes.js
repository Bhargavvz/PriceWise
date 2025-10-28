import express from 'express';
import { 
  getSavings, 
  getPriceTrends, 
  getStats,
  getPopularProducts 
} from '../controllers/analyticsController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/savings', protect, getSavings);
router.get('/trends', protect, getPriceTrends);
router.get('/stats', protect, getStats);
router.get('/popular', optionalAuth, getPopularProducts);

export default router;
