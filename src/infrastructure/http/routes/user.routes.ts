import { Router } from 'express';
import { getUserByEmail, createUser } from '../controllers/user.controller';
import { validateCreateUser } from '../validators/user.validator';

const router = Router();

router.get('/:email', getUserByEmail);
router.post('/', validateCreateUser, createUser);

export default router;
