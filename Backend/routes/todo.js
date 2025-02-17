import express from 'express';
import {getAllTodos, getTodo, updateTodo, deleteTodo, addTodo} from '../controllers/todo.js';
import { verifyToken } from '../middlewares/verify.js';
const router = express.Router();

router.get('/', verifyToken , getAllTodos);

router.post('/', verifyToken, addTodo);

router.put('/:id', verifyToken, updateTodo);

router.delete('/:id', verifyToken, deleteTodo);

router.get('/:id',verifyToken , getTodo);

export default router;