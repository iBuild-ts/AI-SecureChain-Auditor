import React, { useState, useEffect } from 'react';
import { X, Loader, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import axios from '../api/axiosConfig';
import './PaymentModal.css';

function PaymentModal({ isOpen, onClose, tier, onSuccess }) {
  const [step, setStep] = useState('wallet'); // wallet, network, payment, verify, success
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [networks, setNetworks] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    if (isOpen && tier) {
      // Reset state when modal opens
      setStep('wallet');
      setWalletAddress('');
      setTxHash('');
      setError('');
      setSuccess('');
      setSelectedNetwork(null);
      setVerificationStatus(null);
      fetchData();
    }
  }, [isOpen, tier]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!tier) {
        setError('Invalid subscription tier');
        setLoading(false);
        return;
      }

      const [networksRes, pricingRes] = await Promise.all([
        axios.get('/api/payments/networks'),
        axios.get(`/api/payments/pricing?tier=${tier}`)
      ]);
      
      setNetworks(networksRes.data);
      setPricing(pricingRes.data);
      setError('');
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError(err.response?.data?.message || 'Failed to load payment information');
      setNetworks([]);
      setPricing(null);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setError('');
      
      if (!window.ethereum) {
        setError('MetaMask not found. Please install MetaMask extension.');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setStep('network');
        setError('');
      } else {
        setError('No accounts found in MetaMask');
      }
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
      console.error('Wallet connection error:', err);
    }
  };

  const selectNetwork = (network) => {
    setSelectedNetwork(network);
    setStep('payment');
  };

  const handlePaymentInstructions = () => {
    if (!pricing || !selectedNetwork) return;

    const instructions = {
      treasuryAddress: pricing.treasuryAddress,
      amount: pricing.usdtAmount,
      tokenAddress: selectedNetwork.usdtAddress,
      network: selectedNetwork.name,
      chainId: selectedNetwork.chainId
    };

    // Copy to clipboard
    const text = `Send ${instructions.amount} USDT to ${instructions.treasuryAddress} on ${instructions.network}`;
    navigator.clipboard.writeText(text);
    setSuccess('Instructions copied to clipboard!');

    // Open in new window for user to complete transaction
    window.open(`https://app.uniswap.org/swap?outputCurrency=${instructions.tokenAddress}`, '_blank');
  };

  const verifyTransaction = async () => {
    if (!txHash || !walletAddress || !selectedNetwork || !pricing) {
      setError('Missing required information');
      return;
    }

    try {
      setVerifying(true);
      setError('');

      const response = await axios.post('/api/payments/verify', {
        txHash,
        fromAddress: walletAddress,
        tokenAddress: selectedNetwork.usdtAddress,
        amount: pricing.usdtAmount,
        tier,
        chainId: selectedNetwork.chainId
      });

      setVerificationStatus(response.data.transaction);
      setSuccess('Payment verified! Your subscription has been upgraded.');
      setStep('success');

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data.user);
      }

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setVerificationStatus({
        success: false,
        status: 'error'
      });
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="modal-content">
            <div className="loading-spinner">
              <Loader className="spinner" />
              <p>Loading payment information...</p>
            </div>
          </div>
        ) : (
          <div className="modal-content">
            {/* Step 1: Connect Wallet */}
            {step === 'wallet' && (
              <div className="payment-step">
                <h3>Step 1: Connect Your Wallet</h3>
                <p>Connect your MetaMask wallet to proceed with payment</p>
                <button className="btn btn-primary btn-large" onClick={connectWallet}>
                  Connect MetaMask
                </button>
                <p className="info-text">
                  💡 You need MetaMask installed to make payments
                </p>
              </div>
            )}

            {/* Step 2: Select Network */}
            {step === 'network' && (
              <div className="payment-step">
                <h3>Step 2: Select Network</h3>
                <p>Choose the blockchain network for payment</p>
                <div className="networks-grid">
                  {networks.map((network) => (
                    <button
                      key={network.chainId}
                      className={`network-card ${selectedNetwork?.chainId === network.chainId ? 'selected' : ''}`}
                      onClick={() => selectNetwork(network)}
                    >
                      <div className="network-name">{network.name}</div>
                      <div className="network-chainid">Chain ID: {network.chainId}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Payment Instructions */}
            {step === 'payment' && pricing && selectedNetwork && (
              <div className="payment-step">
                <h3>Step 3: Send Payment</h3>
                <div className="payment-info">
                  <div className="info-row">
                    <span>Amount:</span>
                    <strong>{pricing.usdtAmount} USDT</strong>
                  </div>
                  <div className="info-row">
                    <span>Network:</span>
                    <strong>{selectedNetwork.name}</strong>
                  </div>
                  <div className="info-row">
                    <span>To Address:</span>
                    <div className="address-display">
                      <code>{pricing.treasuryAddress}</code>
                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(pricing.treasuryAddress);
                          setSuccess('Address copied!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="info-row">
                    <span>Token:</span>
                    <strong>USDT (ERC20)</strong>
                  </div>
                </div>

                <div className="payment-instructions">
                  <h4>How to Send Payment:</h4>
                  <ol>
                    <li>Open your wallet (MetaMask, Trust Wallet, etc.)</li>
                    <li>Select {selectedNetwork.name} network</li>
                    <li>Send {pricing.usdtAmount} USDT to the address above</li>
                    <li>Copy the transaction hash (TX ID)</li>
                    <li>Paste it below to verify</li>
                  </ol>
                </div>

                <div className="form-group">
                  <label>Transaction Hash (TX ID)</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button
                  className="btn btn-primary btn-large"
                  onClick={() => setStep('verify')}
                  disabled={!txHash}
                >
                  Verify Payment
                </button>

                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-tx-link"
                >
                  View on Block Explorer <ExternalLink size={16} />
                </a>
              </div>
            )}

            {/* Step 4: Verify */}
            {step === 'verify' && (
              <div className="payment-step">
                <h3>Step 4: Verify Payment</h3>
                {verifying ? (
                  <div className="verification-loading">
                    <Loader className="spinner" />
                    <p>Verifying transaction on blockchain...</p>
                  </div>
                ) : verificationStatus?.success ? (
                  <div className="verification-success">
                    <CheckCircle size={48} className="success-icon" />
                    <h4>Payment Verified!</h4>
                    <p>Your subscription has been upgraded successfully.</p>
                    <div className="tx-details">
                      <p><strong>Transaction:</strong> {verificationStatus.transactionHash}</p>
                      <p><strong>Block:</strong> {verificationStatus.blockNumber}</p>
                    </div>
                  </div>
                ) : (
                  <div className="verification-error">
                    <AlertCircle size={48} className="error-icon" />
                    <h4>Verification Failed</h4>
                    <p>{error || 'Could not verify the transaction'}</p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setStep('payment')}
                    >
                      Go Back
                    </button>
                  </div>
                )}

                {!verificationStatus && (
                  <button
                    className="btn btn-primary btn-large"
                    onClick={verifyTransaction}
                    disabled={verifying}
                  >
                    {verifying ? 'Verifying...' : 'Verify Payment'}
                  </button>
                )}
              </div>
            )}

            {/* Step 5: Success */}
            {step === 'success' && (
              <div className="payment-step">
                <div className="success-message">
                  <CheckCircle size={64} className="success-icon-large" />
                  <h3>Upgrade Successful!</h3>
                  <p>Your subscription has been upgraded to {tier.toUpperCase()}</p>
                  <p className="success-details">
                    You now have unlimited audits and all premium features.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="success-message-toast">
                <CheckCircle size={20} />
                <span>{success}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
