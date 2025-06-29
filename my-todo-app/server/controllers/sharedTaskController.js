import SharedTask from '../models/sharedTasks.js';

export const shareTask = async (req, res) => {
  const { from, to, task } = req.body;
  try {
    const shared = await SharedTask.create({ from, to, task });
    res.status(201).json(shared);
  } catch (err) {
    res.status(500).json({ error: 'Failed to share task' });
  }
};

export const getSharedTasksForUser = async (req, res) => {
  const { email } = req.params;
  try {
    const shared = await SharedTask.find({ to: email });
    res.status(200).json(shared);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shared tasks' });
  }
};
