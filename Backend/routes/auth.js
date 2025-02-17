import express from 'express';
import { register, login, logout } from '../Controllers/auth.js';
import { verifyToken } from '../middlewares/verify.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

export default router;
