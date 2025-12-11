const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Upgrade subscription
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { tier } = req.body;

    if (!['free', 'recommended', 'premium'].includes(tier)) {
      return res.status(400).json({ message: 'Invalid tier' });
    }

    const user = await User.findById(req.userId);
    user.tier = tier;

    // Set subscription expiry (1 year from now)
    user.subscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    // Reset audit count for new tier
    if (tier === 'free') {
      user.monthlyAuditLimit = 3;
    } else if (tier === 'recommended') {
      user.monthlyAuditLimit = Infinity;
    } else if (tier === 'premium') {
      user.monthlyAuditLimit = Infinity;
    }

    await user.save();

    res.json({
      message: 'Subscription upgraded successfully',
      user: {
        id: user._id,
        email: user.email,
        tier: user.tier,
        subscriptionExpiry: user.subscriptionExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Upgrade failed', error: error.message });
  }
});

// Get usage stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const Audit = require('../models/Audit');
    const audits = await Audit.find({ userId: req.userId });

    const stats = {
      tier: user.tier,
      totalAudits: audits.length,
      monthlyAuditLimit: user.monthlyAuditLimit,
      auditCount: user.auditCount,
      vulnerabilitiesFound: audits.reduce((sum, audit) => sum + audit.vulnerabilities.length, 0),
      averageRating: audits.length > 0 
        ? (audits.reduce((sum, audit) => sum + audit.postAuditRating, 0) / audits.length).toFixed(2)
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
