import express from 'express';
import { 
  createList, 
  getLists, 
  getList, 
  updateList, 
  deleteList,
  addItem,
  updateItem,
  removeItem,
  optimizeList
} from '../controllers/listController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createList);
router.get('/', protect, getLists);
router.get('/:id', protect, getList);
router.put('/:id', protect, updateList);
router.delete('/:id', protect, deleteList);
router.post('/:id/items', protect, addItem);
router.post('/:id/optimize', protect, optimizeList);
router.put('/items/:itemId', protect, updateItem);
router.delete('/items/:itemId', protect, removeItem);

export default router;
