const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  tier: { 
    type: String, 
    enum: ['free', 'recommended', 'premium'], 
    default: 'free' 
  },
  auditCount: { type: Number, default: 0 },
  monthlyAuditLimit: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
  subscriptionExpiry: { type: Date, default: null },
  apiKey: { type: String, unique: true, sparse: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
