const express = require('express');
const auth = require('../middleware/auth');
const Audit = require('../models/Audit');
const User = require('../models/User');
const vulnerabilityDetector = require('../services/vulnerabilityDetector');
const reportGenerator = require('../services/reportGenerator');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Create new audit
router.post('/create', auth, async (req, res) => {
  try {
    const { contractName, contractCode, chain } = req.body;

    if (!contractName || !contractCode) {
      return res.status(400).json({ message: 'Contract name and code are required' });
    }

    const mongoConnected = req.app.locals.mongoConnected;
    const inMemoryUsers = req.app.locals.inMemoryUsers;
    const inMemoryAudits = req.app.locals.inMemoryAudits;

    let user = null;

    if (mongoConnected) {
      // Use MongoDB
      user = await User.findById(req.userId);
    } else {
      // Use in-memory storage
      for (let [email, userData] of inMemoryUsers) {
        if (userData._id === req.userId) {
          user = userData;
          break;
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check audit limit based on tier
    if (user.tier === 'free' && user.auditCount >= user.monthlyAuditLimit) {
      return res.status(403).json({ 
        message: 'Free tier limit reached. Upgrade to continue auditing.',
        limit: user.monthlyAuditLimit
      });
    }

    // Run vulnerability detection
    const vulnerabilities = vulnerabilityDetector.analyzeCode(contractCode);
    const preAuditRating = vulnerabilityDetector.calculateRating(vulnerabilities);

    // Generate clean code
    let cleanCode = contractCode;
    vulnerabilities.forEach(vuln => {
      if (vuln.fixedCode) {
        cleanCode += `\n\n// Fix for ${vuln.type}:\n${vuln.fixedCode}`;
      }
    });

    // Calculate post-audit rating (after fixes applied)
    const postAuditRating = Math.min(5, preAuditRating + 1);

    if (mongoConnected) {
      // Use MongoDB
      const audit = new Audit({
        userId: req.userId,
        contractName,
        contractCode,
        chain: chain || 'ethereum',
        status: 'completed',
        vulnerabilities,
        preAuditRating,
        postAuditRating,
        cleanCode,
        completedAt: new Date()
      });

      await audit.save();

      // Update user audit count
      user.auditCount += 1;
      await user.save();

      res.status(201).json({
        message: 'Audit completed successfully',
        audit: {
          id: audit._id,
          contractName: audit.contractName,
          status: audit.status,
          preAuditRating: audit.preAuditRating,
          postAuditRating: audit.postAuditRating,
          vulnerabilityCount: audit.vulnerabilities.length,
          createdAt: audit.createdAt
        }
      });
    } else {
      // Use in-memory storage
      const auditId = 'audit_' + Date.now();
      const audit = {
        _id: auditId,
        userId: req.userId,
        contractName,
        contractCode,
        chain: chain || 'ethereum',
        status: 'completed',
        vulnerabilities,
        preAuditRating,
        postAuditRating,
        cleanCode,
        completedAt: new Date(),
        createdAt: new Date(),
        reportGenerated: false,
        reportPath: null
      };

      inMemoryAudits.set(auditId, audit);

      // Update user audit count
      user.auditCount += 1;

      res.status(201).json({
        message: 'Audit completed successfully',
        audit: {
          id: audit._id,
          contractName: audit.contractName,
          status: audit.status,
          preAuditRating: audit.preAuditRating,
          postAuditRating: audit.postAuditRating,
          vulnerabilityCount: audit.vulnerabilities.length,
          createdAt: audit.createdAt
        }
      });
    }
  } catch (error) {
    console.error('Audit creation error:', error);
    res.status(500).json({ message: 'Audit creation failed', error: error.message });
  }
});

// Get audit details
router.get('/:auditId', auth, async (req, res) => {
  try {
    const mongoConnected = req.app.locals.mongoConnected;
    const inMemoryAudits = req.app.locals.inMemoryAudits;

    if (mongoConnected) {
      // Use MongoDB
      const audit = await Audit.findById(req.params.auditId);
      
      if (!audit) {
        return res.status(404).json({ message: 'Audit not found' });
      }

      if (audit.userId.toString() !== req.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      res.json(audit);
    } else {
      // Use in-memory storage
      const audit = inMemoryAudits.get(req.params.auditId);

      if (!audit) {
        return res.status(404).json({ message: 'Audit not found' });
      }

      if (audit.userId !== req.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      res.json(audit);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit', error: error.message });
  }
});

// Get user's audits
router.get('/', auth, async (req, res) => {
  try {
    const mongoConnected = req.app.locals.mongoConnected;
    const inMemoryAudits = req.app.locals.inMemoryAudits;

    if (mongoConnected) {
      // Use MongoDB
      const audits = await Audit.find({ userId: req.userId }).sort({ createdAt: -1 });
      res.json(audits);
    } else {
      // Use in-memory storage
      const audits = [];
      for (let [auditId, audit] of inMemoryAudits) {
        if (audit.userId === req.userId) {
          audits.push(audit);
        }
      }
      // Sort by createdAt descending
      audits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json(audits);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audits', error: error.message });
  }
});

// Generate PDF report
router.post('/:auditId/generate-report', auth, async (req, res) => {
  try {
    const mongoConnected = req.app.locals.mongoConnected;
    const inMemoryAudits = req.app.locals.inMemoryAudits;

    let audit = null;

    if (mongoConnected) {
      // Use MongoDB
      audit = await Audit.findById(req.params.auditId);
    } else {
      // Use in-memory storage
      audit = inMemoryAudits.get(req.params.auditId);
    }
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    const auditUserId = mongoConnected ? audit.userId.toString() : audit.userId;
    if (auditUserId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = path.join(reportsDir, `audit-${audit._id}.pdf`);
    await reportGenerator.generatePDFReport(audit, reportPath);

    if (mongoConnected) {
      // Use MongoDB
      audit.reportGenerated = true;
      audit.reportPath = reportPath;
      await audit.save();
    } else {
      // Use in-memory storage
      audit.reportGenerated = true;
      audit.reportPath = reportPath;
      inMemoryAudits.set(req.params.auditId, audit);
    }

    res.json({
      message: 'Report generated successfully',
      reportPath: reportPath
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Report generation failed', error: error.message });
  }
});

// Download report
router.get('/:auditId/download-report', auth, async (req, res) => {
  try {
    const mongoConnected = req.app.locals.mongoConnected;
    const inMemoryAudits = req.app.locals.inMemoryAudits;

    let audit = null;

    if (mongoConnected) {
      // Use MongoDB
      audit = await Audit.findById(req.params.auditId);
    } else {
      // Use in-memory storage
      audit = inMemoryAudits.get(req.params.auditId);
    }
    
    if (!audit || !audit.reportPath) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const auditUserId = mongoConnected ? audit.userId.toString() : audit.userId;
    if (auditUserId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.download(audit.reportPath, `audit-${audit.contractName}.pdf`);
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

module.exports = router;
