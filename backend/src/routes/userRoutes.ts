import express from 'express';

import { registerUser } from '../controllers/registerController';

const router = express.Router();

router.post('/register', registerUser);

export default router;