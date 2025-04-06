import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  creditScores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditScore'
  }]
});

const User = mongoose.model('User', userSchema);

export default User;