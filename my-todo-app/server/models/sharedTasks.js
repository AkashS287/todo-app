import mongoose from 'mongoose';

const sharedTaskSchema = new mongoose.Schema({
  from: String,
  to: String,
  task: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SharedTask = mongoose.model('SharedTask', sharedTaskSchema);

export default SharedTask;
