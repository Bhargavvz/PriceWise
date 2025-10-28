import express from 'express';
import { 
  getProductPrices, 
  getPriceHistory, 
  comparePrices, 
  getSaleItems 
} from '../controllers/priceController.js';

const router = express.Router();

router.get('/product/:productId', getProductPrices);
router.get('/history/:productId/:storeId', getPriceHistory);
router.post('/compare', comparePrices);
router.get('/sales', getSaleItems);

export default router;
