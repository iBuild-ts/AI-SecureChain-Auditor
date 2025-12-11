const express = require('express');
const auth = require('../middleware/auth');
const Audit = require('../models/Audit');

const router = express.Router();

// Get audit report summary
router.get('/:auditId', auth, async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    if (audit.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const summary = {
      contractName: audit.contractName,
      chain: audit.chain,
      createdAt: audit.createdAt,
      preAuditRating: audit.preAuditRating,
      postAuditRating: audit.postAuditRating,
      vulnerabilities: {
        critical: audit.vulnerabilities.filter(v => v.severity === 'Critical').length,
        high: audit.vulnerabilities.filter(v => v.severity === 'High').length,
        medium: audit.vulnerabilities.filter(v => v.severity === 'Medium').length,
        low: audit.vulnerabilities.filter(v => v.severity === 'Low').length,
        total: audit.vulnerabilities.length
      },
      reportGenerated: audit.reportGenerated,
      completedAt: audit.completedAt
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
});

// Get vulnerability details
router.get('/:auditId/vulnerabilities', auth, async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    if (audit.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      contractName: audit.contractName,
      vulnerabilities: audit.vulnerabilities
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vulnerabilities', error: error.message });
  }
});

// Get clean code
router.get('/:auditId/clean-code', auth, async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.auditId);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    if (audit.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      contractName: audit.contractName,
      cleanCode: audit.cleanCode
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clean code', error: error.message });
  }
});

module.exports = router;
