import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
} from '../controllers/bookController';

const router = express.Router();

router.post('/books', authenticateToken, createBook);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.put('/books/:id', authenticateToken, updateBook);
router.delete('/books/:id', authenticateToken, deleteBook);

export default router;
