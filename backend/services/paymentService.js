const Web3 = require('web3');

// Treasury address where payments are received
const TREASURY_ADDRESS = '0xdf49e29b6840d7ba57e4b5acddc770047f67ff13';

// USDT contract address (Ethereum mainnet)
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// ERC20 ABI for token transfers
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  }
];

// Pricing configuration
const PRICING = {
  recommended: {
    usd: 49,
    usdt: 49,
    duration: 30 // days
  },
  premium: {
    usd: 199,
    usdt: 199,
    duration: 30 // days
  }
};

class PaymentService {
  constructor() {
    try {
      // Initialize Web3 with Ethereum mainnet
      const rpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com';
      this.web3 = new Web3(rpcUrl);
      this.treasuryAddress = TREASURY_ADDRESS;
      this.usdtAddress = USDT_ADDRESS;
    } catch (error) {
      console.error('Error initializing Web3:', error);
      // Create a dummy web3 instance for development
      this.web3 = null;
      this.treasuryAddress = TREASURY_ADDRESS;
      this.usdtAddress = USDT_ADDRESS;
    }
  }

  /**
   * Verify a transaction on the blockchain
   * @param {string} txHash - Transaction hash
   * @param {string} fromAddress - Sender address
   * @param {string} tokenAddress - Token contract address
   * @param {number} amount - Amount in smallest units (wei)
   * @returns {Promise<Object>} Transaction details
   */
  async verifyTransaction(txHash, fromAddress, tokenAddress, amount) {
    try {
      if (!this.web3) {
        return {
          success: false,
          message: 'Web3 not initialized. Please check RPC configuration.',
          status: 'error'
        };
      }

      // Get transaction receipt
      const receipt = await this.web3.eth.getTransactionReceipt(txHash);

      if (!receipt) {
        return {
          success: false,
          message: 'Transaction not found or still pending',
          status: 'pending'
        };
      }

      if (receipt.status === false) {
        return {
          success: false,
          message: 'Transaction failed',
          status: 'failed'
        };
      }

      // Get transaction details
      const tx = await this.web3.eth.getTransaction(txHash);

      // Verify transaction details
      if (tx.from.toLowerCase() !== fromAddress.toLowerCase()) {
        return {
          success: false,
          message: 'Transaction sender does not match',
          status: 'invalid'
        };
      }

      // For ERC20 transfers, we need to decode the transaction data
      // to verify the amount and recipient
      const verified = await this.verifyTokenTransfer(
        receipt,
        tokenAddress,
        fromAddress,
        amount
      );

      if (!verified) {
        return {
          success: false,
          message: 'Token transfer details do not match',
          status: 'invalid'
        };
      }

      return {
        success: true,
        message: 'Transaction verified successfully',
        status: 'confirmed',
        transactionHash: txHash,
        blockNumber: receipt.blockNumber,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return {
        success: false,
        message: error.message,
        status: 'error'
      };
    }
  }

  /**
   * Verify ERC20 token transfer
   * @private
   */
  async verifyTokenTransfer(receipt, tokenAddress, fromAddress, expectedAmount) {
    try {
      // Parse logs to find Transfer events
      const contract = new this.web3.eth.Contract(ERC20_ABI, tokenAddress);

      // Look for Transfer event in logs
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() === tokenAddress.toLowerCase()) {
          try {
            const decoded = contract._decodeLog(
              [
                { type: 'address', name: 'from', indexed: true },
                { type: 'address', name: 'to', indexed: true },
                { type: 'uint256', name: 'value', indexed: false }
              ],
              log.data,
              log.topics
            );

            // Check if transfer is from user to treasury
            if (
              decoded.from.toLowerCase() === fromAddress.toLowerCase() &&
              decoded.to.toLowerCase() === this.treasuryAddress.toLowerCase() &&
              decoded.value === expectedAmount.toString()
            ) {
              return true;
            }
          } catch (e) {
            // Continue checking other logs
            continue;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error verifying token transfer:', error);
      return false;
    }
  }

  /**
   * Get payment amount for a tier
   * @param {string} tier - Subscription tier (recommended, premium)
   * @returns {Object} Payment details
   */
  getPaymentAmount(tier) {
    const tierData = PRICING[tier.toLowerCase()];
    if (!tierData) {
      return null;
    }

    return {
      tier,
      usdAmount: tierData.usd,
      usdtAmount: tierData.usdt,
      duration: tierData.duration,
      currency: 'USDT',
      treasuryAddress: this.treasuryAddress,
      usdtAddress: this.usdtAddress
    };
  }

  /**
   * Get supported networks
   */
  getSupportedNetworks() {
    return [
      {
        name: 'Ethereum Mainnet',
        chainId: 1,
        rpcUrl: 'https://eth.llamarpc.com',
        usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      },
      {
        name: 'Polygon',
        chainId: 137,
        rpcUrl: 'https://polygon-rpc.com',
        usdtAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
      },
      {
        name: 'Arbitrum',
        chainId: 42161,
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        usdtAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
      },
      {
        name: 'Optimism',
        chainId: 10,
        rpcUrl: 'https://mainnet.optimism.io',
        usdtAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'
      }
    ];
  }

  /**
   * Get network info by chain ID
   */
  getNetworkInfo(chainId) {
    const networks = this.getSupportedNetworks();
    return networks.find(n => n.chainId === chainId);
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address) {
    if (!this.web3) {
      // Basic validation if web3 not available
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    return this.web3.utils.isAddress(address);
  }

  /**
   * Convert amount to smallest units (wei for ETH, 6 decimals for USDT)
   */
  toSmallestUnit(amount, decimals = 6) {
    if (!this.web3) {
      // Basic conversion if web3 not available
      return (amount * Math.pow(10, decimals)).toString();
    }
    return this.web3.utils.toWei(amount.toString(), 'mwei');
  }

  /**
   * Convert from smallest units to readable amount
   */
  fromSmallestUnit(amount, decimals = 6) {
    if (!this.web3) {
      // Basic conversion if web3 not available
      return amount / Math.pow(10, decimals);
    }
    return this.web3.utils.fromWei(amount.toString(), 'mwei');
  }
}

module.exports = new PaymentService();
