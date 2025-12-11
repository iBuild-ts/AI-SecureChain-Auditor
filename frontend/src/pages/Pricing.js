import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { Check, Star } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import './Pricing.css';

function Pricing({ user, isAuthenticated }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, tier: null });

  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: 'forever',
      tier: 'free',
      description: 'Get started with SecureChain Auditor',
      features: [
        '3 audits per month',
        'Basic vulnerability scanning',
        'Summary reports',
        'Pre-audit rating only',
        'Community support'
      ],
      cta: 'Current Plan',
      highlighted: false
    },
    {
      name: 'Recommended',
      price: '$49',
      period: '/month or $499/year',
      tier: 'recommended',
      description: 'Perfect for teams and startups',
      features: [
        'Unlimited audits',
        'Full PDF reports',
        'Clean code generation',
        'Pre & post-audit ratings',
        'Multi-chain support',
        'Priority email support',
        'Community knowledge base'
      ],
      cta: 'Upgrade Now',
      highlighted: true
    },
    {
      name: 'Premium Exclusive',
      price: '$199',
      period: '/month or $1,999/year',
      tier: 'premium',
      description: 'For enterprises and high-stakes projects',
      features: [
        'All Recommended features',
        'Advanced AI simulations',
        'Manual expert review',
        'Forensic-level analysis',
        'Unlimited API calls',
        'White-label reports',
        'Enterprise integrations',
        '24/7 dedicated support',
        'Beta feature access'
      ],
      cta: 'Upgrade Now',
      highlighted: false
    }
  ];

  const handleUpgrade = (tier) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.tier === tier) {
      return;
    }

    // Open payment modal for crypto payment
    setPaymentModal({ isOpen: true, tier });
  };

  const handlePaymentSuccess = (updatedUser) => {
    // Update user data and close modal
    window.location.reload();
  };

  return (
    <div className="pricing-page">
      <div className="container">
        {/* Header */}
        <div className="pricing-header">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your smart contract security needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div 
              key={plan.tier}
              className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.highlighted && (
                <div className="popular-badge">
                  <Star size={16} />
                  Most Popular
                </div>
              )}

              <div className="plan-header">
                <h2>{plan.name}</h2>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>

              <button 
                className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-outline'} btn-block`}
                onClick={() => handleUpgrade(plan.tier)}
                disabled={loading || user?.tier === plan.tier}
              >
                {user?.tier === plan.tier ? 'Current Plan' : plan.cta}
              </button>

              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature">
                    <Check size={18} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I upgrade or downgrade anytime?</h3>
              <p>Yes! You can change your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept all major credit cards, PayPal, and wire transfers for enterprise plans.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a free trial for paid plans?</h3>
              <p>Yes, start with our Free Trial to test the platform, then upgrade when ready.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>We offer a 30-day money-back guarantee if you're not satisfied with your plan.</p>
            </div>
            <div className="faq-item">
              <h3>What about API access?</h3>
              <p>API access is included with Recommended and Premium plans for CI/CD integration.</p>
            </div>
            <div className="faq-item">
              <h3>Can I get a custom plan?</h3>
              <p>Absolutely! Contact our sales team for enterprise and custom solutions.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to secure your smart contracts?</h2>
          <p>Start with our free trial today and experience the power of AI-driven security audits.</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/register')}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, tier: null })}
        tier={paymentModal.tier}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default Pricing;
