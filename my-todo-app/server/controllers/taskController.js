import Task from '../models/task.js'


export const getTasks = async (req, res) => {
  const { uid } = req.query;
  const tasks = await Task.find({
    $or: [{ uid }, { sharedWith: uid }]
  }).sort({ createdAt: -1 });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const task = new Task(req.body);
  const saved = await task.save();
  res.status(201).json(saved);
};

export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};
