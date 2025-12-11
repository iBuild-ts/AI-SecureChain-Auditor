const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contractName: { type: String, required: true },
  contractCode: { type: String, required: true },
  chain: { type: String, default: 'ethereum' },
  status: { 
    type: String, 
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  preAuditRating: { type: Number, min: 1, max: 5, default: null },
  postAuditRating: { type: Number, min: 1, max: 5, default: null },
  vulnerabilities: [{
    id: String,
    type: String,
    severity: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'] },
    description: String,
    location: String,
    codeSnippet: String,
    remediation: String,
    fixedCode: String
  }],
  cleanCode: { type: String, default: null },
  reportGenerated: { type: Boolean, default: false },
  reportPath: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Audit', auditSchema);
