import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  uid: String,
  text: String,
  completed: Boolean,
  sharedWith: [String]
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
