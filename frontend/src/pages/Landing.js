import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Code, FileText, Star, Zap, Lock, ChevronDown, ArrowRight } from 'lucide-react';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('free');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Shield className="feature-icon" />,
      title: 'Automated Detection',
      description: 'Detects 6 types of vulnerabilities including reentrancy, integer overflow, and access control flaws'
    },
    {
      icon: <Code className="feature-icon" />,
      title: 'Clean Code Generation',
      description: 'Automatically generates fixed versions of vulnerable code with step-by-step remediation guides'
    },
    {
      icon: <FileText className="feature-icon" />,
      title: 'Professional Reports',
      description: 'Generate comprehensive PDF audit reports with executive summaries and compliance certifications'
    },
    {
      icon: <Star className="feature-icon" />,
      title: 'Security Ratings',
      description: 'Pre and post-audit 1-5 star ratings to track security improvements'
    },
    {
      icon: <Zap className="feature-icon" />,
      title: 'Multi-Chain Support',
      description: 'Audit contracts on Ethereum, Polygon, BSC, Arbitrum, and Optimism'
    },
    {
      icon: <Lock className="feature-icon" />,
      title: 'Enterprise Security',
      description: 'JWT authentication, encrypted data, and compliance with industry standards'
    }
  ];

  const packages = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '$0',
      period: '/month',
      description: 'Perfect for testing the platform',
      features: [
        '3 audits per month',
        'Basic vulnerability scanning',
        'Summary reports',
        'Pre-audit rating only',
        'Community support'
      ],
      highlighted: false
    },
    {
      id: 'recommended',
      name: 'Recommended',
      price: '$49',
      period: '/month',
      description: 'Ideal for teams and startups',
      features: [
        'Unlimited audits',
        'Full PDF reports',
        'Clean code generation',
        'Pre & post-audit ratings',
        'Multi-chain support',
        'Priority email support',
        'Knowledge base access'
      ],
      highlighted: true
    },
    {
      id: 'premium',
      name: 'Premium Exclusive',
      price: '$199',
      period: '/month',
      description: 'For enterprises and high-stakes projects',
      features: [
        'All Recommended features',
        'Advanced AI simulations',
        'Manual expert review',
        'Forensic-level analysis',
        'Unlimited API calls',
        'White-label reports',
        'Dedicated account manager',
        '24/7 priority support'
      ],
      highlighted: false
    }
  ];

  const stats = [
    { number: '1000+', label: 'Contracts Audited' },
    { number: '50K+', label: 'Vulnerabilities Found' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield size={32} />
            <span>SecureChain Auditor™</span>
          </div>
          <div className="nav-buttons">
            <button 
              className="nav-btn signin-btn"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button 
              className="nav-btn signup-btn"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-content">
          <div className="hero-badge">🔐 AI-Powered Smart Contract Security</div>
          
          <h1 className="hero-title">
            Secure Your Smart Contracts
            <span className="gradient-text"> With Confidence</span>
          </h1>
          
          <p className="hero-subtitle">
            SecureChain Auditor™ is the industry-leading platform for automated smart contract security auditing. 
            Detect vulnerabilities, generate clean code, and get professional audit reports in minutes.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/login')}
            >
              <Zap size={20} />
              Begin Audit
              <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary btn-large">
              Watch Demo
            </button>
          </div>

          <div className="hero-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <Shield size={40} />
            <p>Reentrancy</p>
          </div>
          <div className="floating-card card-2">
            <Code size={40} />
            <p>Fixed Code</p>
          </div>
          <div className="floating-card card-3">
            <FileText size={40} />
            <p>PDF Report</p>
          </div>
        </div>

        <div className="scroll-indicator">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to audit smart contracts professionally</p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple, fast, and secure smart contract auditing</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Contract</h3>
              <p>Paste your Solidity code or upload a file</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Analyze</h3>
              <p>AI detects vulnerabilities in seconds</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Review Results</h3>
              <p>See detailed findings and clean code</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Report</h3>
              <p>Download professional PDF audit report</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vulnerabilities Section */}
      <section className="vulnerabilities-section">
        <div className="container">
          <div className="section-header">
            <h2>Vulnerabilities We Detect</h2>
            <p>Comprehensive detection of common and advanced threats</p>
          </div>

          <div className="vulnerabilities-grid">
            <div className="vuln-card critical">
              <div className="vuln-badge">Critical</div>
              <h3>Reentrancy Attacks</h3>
              <p>Detects unsafe external calls that could be exploited for recursive attacks</p>
            </div>
            <div className="vuln-card high">
              <div className="vuln-badge">High</div>
              <h3>Integer Overflow/Underflow</h3>
              <p>Identifies arithmetic operations without proper bounds checking</p>
            </div>
            <div className="vuln-card high">
              <div className="vuln-badge">High</div>
              <h3>Access Control Flaws</h3>
              <p>Finds missing permission checks and authorization vulnerabilities</p>
            </div>
            <div className="vuln-card high">
              <div className="vuln-badge">High</div>
              <h3>Unchecked External Calls</h3>
              <p>Detects calls without return value validation</p>
            </div>
            <div className="vuln-card medium">
              <div className="vuln-badge">Medium</div>
              <h3>Gas Inefficiencies</h3>
              <p>Identifies code patterns that waste gas and increase costs</p>
            </div>
            <div className="vuln-card medium">
              <div className="vuln-badge">Medium</div>
              <h3>Hardcoded Values</h3>
              <p>Finds hardcoded addresses and configuration values</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that fits your needs</p>
          </div>

          <div className="pricing-cards">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`pricing-card ${pkg.highlighted ? 'highlighted' : ''}`}
              >
                {pkg.highlighted && <div className="popular-badge">Most Popular</div>}
                
                <h3>{pkg.name}</h3>
                <p className="package-description">{pkg.description}</p>
                
                <div className="price">
                  <span className="amount">{pkg.price}</span>
                  <span className="period">{pkg.period}</span>
                </div>

                <button 
                  className={`btn ${pkg.highlighted ? 'btn-primary' : 'btn-secondary'} btn-block`}
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </button>

                <div className="features-list">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="checkmark">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose SecureChain Auditor™?</h2>
            <p>The gold standard for blockchain security</p>
          </div>

          <div className="reasons-grid">
            <div className="reason-card">
              <div className="reason-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Analyze contracts in under 5 seconds with our advanced AI engine</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🎯</div>
              <h3>Highly Accurate</h3>
              <p>Detect vulnerabilities with industry-leading precision and zero false positives</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">📊</div>
              <h3>Professional Reports</h3>
              <p>Generate compliance-ready PDF reports suitable for investors and regulators</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Your code is encrypted and never stored. We prioritize your privacy</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🚀</div>
              <h3>Always Improving</h3>
              <p>Regular updates with new vulnerability detection patterns and features</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">👥</div>
              <h3>Expert Support</h3>
              <p>24/7 support from blockchain security experts and community</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Secure Your Smart Contracts?</h2>
          <p>Join thousands of developers and enterprises using SecureChain Auditor™</p>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/login')}
          >
            <Zap size={20} />
            Begin Your First Audit
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SecureChain Auditor™</h4>
              <p>The industry-leading smart contract audit platform</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#docs">Documentation</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SecureChain Auditor™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
