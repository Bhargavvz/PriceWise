import express from 'express';
import { 
  searchProducts, 
  getProduct, 
  getCategories, 
  getBrands 
} from '../controllers/productController.js';

const router = express.Router();

router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/:id', getProduct);

export default router;
