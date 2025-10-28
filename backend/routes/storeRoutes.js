import express from 'express';
import { 
  getStores, 
  getStore, 
  getNearbyStores, 
  getStoresByChain,
  getChains 
} from '../controllers/storeController.js';

const router = express.Router();

router.get('/', getStores);
router.get('/chains', getChains);
router.get('/nearby', getNearbyStores);
router.get('/chain/:chainName', getStoresByChain);
router.get('/:id', getStore);

export default router;
