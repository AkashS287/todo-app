import express from 'express';
import { shareTask, getSharedTasksForUser } from '../controllers/sharedTaskController.js';

const router = express.Router();

router.post('/', shareTask); // POST /api/shared
router.get('/:email', getSharedTasksForUser); // GET /api/shared/:email

export default router;