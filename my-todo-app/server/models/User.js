import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: String,
  email: String,
  displayName: String
});

export default mongoose.model('User', userSchema);
