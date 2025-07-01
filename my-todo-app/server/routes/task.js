// server/routes/taskRoutes.js
import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/tasks', getTasks);           // GET all tasks
router.post('/tasks', createTask);        // CREATE task
router.put('/tasks/:id', updateTask);     // ✅ UPDATE task
router.delete('/tasks/:id', deleteTask);  // DELETE task

export default router;
