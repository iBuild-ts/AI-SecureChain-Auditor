const express = require('express');
const auth = require('../middleware/auth');
const paymentService = require('../services/paymentService');

const router = express.Router();

/**
 * GET /api/payments/pricing
 * Get pricing information for subscription tiers
 */
router.get('/pricing', (req, res) => {
  try {
    const tier = req.query.tier;

    if (tier) {
      const pricing = paymentService.getPaymentAmount(tier);
      if (!pricing) {
        return res.status(400).json({ message: 'Invalid tier' });
      }
      return res.json(pricing);
    }

    // Return all pricing
    const recommended = paymentService.getPaymentAmount('recommended');
    const premium = paymentService.getPaymentAmount('premium');

    res.json({
      recommended,
      premium,
      treasuryAddress: paymentService.treasuryAddress
    });
  } catch (error) {
    console.error('Pricing error:', error);
    res.status(500).json({ message: 'Error fetching pricing', error: error.message });
  }
});

/**
 * GET /api/payments/networks
 * Get supported blockchain networks
 */
router.get('/networks', (req, res) => {
  try {
    const networks = paymentService.getSupportedNetworks();
    res.json(networks);
  } catch (error) {
    console.error('Networks error:', error);
    res.status(500).json({ message: 'Error fetching networks', error: error.message });
  }
});

/**
 * POST /api/payments/verify
 * Verify a transaction and upgrade user subscription
 */
router.post('/verify', auth, async (req, res) => {
  try {
    const { txHash, fromAddress, tokenAddress, amount, tier, chainId } = req.body;

    // Validate inputs
    if (!txHash || !fromAddress || !tokenAddress || !amount || !tier) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate addresses
    if (!paymentService.isValidAddress(fromAddress)) {
      return res.status(400).json({ message: 'Invalid sender address' });
    }

    if (!paymentService.isValidAddress(tokenAddress)) {
      return res.status(400).json({ message: 'Invalid token address' });
    }

    // Get pricing for tier
    const pricing = paymentService.getPaymentAmount(tier);
    if (!pricing) {
      return res.status(400).json({ message: 'Invalid subscription tier' });
    }

    // Verify the transaction
    const verification = await paymentService.verifyTransaction(
      txHash,
      fromAddress,
      tokenAddress,
      amount
    );

    if (!verification.success) {
      return res.status(400).json({
        message: 'Transaction verification failed',
        details: verification.message,
        status: verification.status
      });
    }

    // Update user subscription
    const mongoConnected = req.app.locals.mongoConnected;
    const inMemoryUsers = req.app.locals.inMemoryUsers;

    let user = null;

    if (mongoConnected) {
      // Use MongoDB
      const User = require('../models/User');
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

    // Update subscription
    user.tier = tier;
    user.subscriptionExpiry = new Date(Date.now() + pricing.duration * 24 * 60 * 60 * 1000);
    user.monthlyAuditLimit = tier === 'premium' ? 999999 : 999999; // Unlimited
    user.lastPaymentTx = txHash;
    user.lastPaymentDate = new Date();
    user.paymentAddress = fromAddress;

    if (mongoConnected) {
      // Save to MongoDB
      await user.save();
    } else {
      // Update in-memory storage
      for (let [email, userData] of inMemoryUsers) {
        if (userData._id === req.userId) {
          Object.assign(userData, user);
          break;
        }
      }
    }

    res.json({
      message: 'Subscription upgraded successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        subscriptionExpiry: user.subscriptionExpiry,
        monthlyAuditLimit: user.monthlyAuditLimit
      },
      transaction: verification
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

/**
 * POST /api/payments/check-transaction
 * Check transaction status without upgrading
 */
router.post('/check-transaction', async (req, res) => {
  try {
    const { txHash, fromAddress, tokenAddress, amount } = req.body;

    if (!txHash || !fromAddress || !tokenAddress || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const verification = await paymentService.verifyTransaction(
      txHash,
      fromAddress,
      tokenAddress,
      amount
    );

    res.json(verification);
  } catch (error) {
    console.error('Transaction check error:', error);
    res.status(500).json({ message: 'Error checking transaction', error: error.message });
  }
});

/**
 * GET /api/payments/treasury
 * Get treasury address and payment info
 */
router.get('/treasury', (req, res) => {
  try {
    res.json({
      treasuryAddress: paymentService.treasuryAddress,
      supportedTokens: [
        {
          name: 'USDT',
          symbol: 'USDT',
          decimals: 6,
          networks: [
            { name: 'Ethereum', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
            { name: 'Polygon', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' },
            { name: 'Arbitrum', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' },
            { name: 'Optimism', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58' }
          ]
        }
      ],
      networks: paymentService.getSupportedNetworks()
    });
  } catch (error) {
    console.error('Treasury error:', error);
    res.status(500).json({ message: 'Error fetching treasury info', error: error.message });
  }
});

module.exports = router;
