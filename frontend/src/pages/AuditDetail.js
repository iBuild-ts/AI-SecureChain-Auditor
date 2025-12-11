import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { ArrowLeft, Download, Copy, Check } from 'lucide-react';
import './AuditDetail.css';

function AuditDetail() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vulnerabilities');
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAudit();
  }, [auditId]);

  const fetchAudit = async () => {
    try {
      const response = await axios.get(`/api/audits/${auditId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAudit(response.data);
    } catch (err) {
      console.error('Error fetching audit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': '#ef4444',
      'High': '#f59e0b',
      'Medium': '#3b82f6',
      'Low': '#10b981'
    };
    return colors[severity] || '#94a3b8';
  };

  if (loading) {
    return (
      <div className="audit-detail">
        <div className="container">
          <div className="loading-state">Loading audit details...</div>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="audit-detail">
        <div className="container">
          <div className="error">Audit not found</div>
        </div>
      </div>
    );
  }

  const criticalCount = audit.vulnerabilities.filter(v => v.severity === 'Critical').length;
  const highCount = audit.vulnerabilities.filter(v => v.severity === 'High').length;
  const mediumCount = audit.vulnerabilities.filter(v => v.severity === 'Medium').length;
  const lowCount = audit.vulnerabilities.filter(v => v.severity === 'Low').length;

  return (
    <div className="audit-detail">
      <div className="container">
        {/* Header */}
        <div className="detail-header">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="header-content">
            <h1>{audit.contractName}</h1>
            <div className="header-meta">
              <span className="badge badge-medium">{audit.chain}</span>
              <span className="text-muted">
                {new Date(audit.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Pre-Audit Rating</div>
            <div className="summary-rating">
              {'⭐'.repeat(Math.round(audit.preAuditRating))}
              <span className="rating-text">{audit.preAuditRating}/5</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Post-Audit Rating</div>
            <div className="summary-rating">
              {'⭐'.repeat(Math.round(audit.postAuditRating))}
              <span className="rating-text">{audit.postAuditRating}/5</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Vulnerabilities</div>
            <div className="summary-value">{audit.vulnerabilities.length}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Status</div>
            <div className="summary-status">
              <span className="badge badge-secondary">{audit.status}</span>
            </div>
          </div>
        </div>

        {/* Vulnerability Summary */}
        <div className="card vulnerability-summary">
          <h2>Vulnerability Breakdown</h2>
          <div className="breakdown-grid">
            <div className="breakdown-item critical">
              <div className="breakdown-count">{criticalCount}</div>
              <div className="breakdown-label">Critical</div>
            </div>
            <div className="breakdown-item high">
              <div className="breakdown-count">{highCount}</div>
              <div className="breakdown-label">High</div>
            </div>
            <div className="breakdown-item medium">
              <div className="breakdown-count">{mediumCount}</div>
              <div className="breakdown-label">Medium</div>
            </div>
            <div className="breakdown-item low">
              <div className="breakdown-count">{lowCount}</div>
              <div className="breakdown-label">Low</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'vulnerabilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('vulnerabilities')}
          >
            Vulnerabilities
          </button>
          <button 
            className={`tab ${activeTab === 'clean-code' ? 'active' : ''}`}
            onClick={() => setActiveTab('clean-code')}
          >
            Clean Code
          </button>
          <button 
            className={`tab ${activeTab === 'original-code' ? 'active' : ''}`}
            onClick={() => setActiveTab('original-code')}
          >
            Original Code
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'vulnerabilities' && (
            <div className="vulnerabilities-list">
              {audit.vulnerabilities.length === 0 ? (
                <div className="empty-state">
                  <p>No vulnerabilities found! ✅</p>
                </div>
              ) : (
                audit.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="vulnerability-card">
                    <div className="vuln-header">
                      <div>
                        <h3>{vuln.type}</h3>
                        <p className="text-muted">{vuln.location}</p>
                      </div>
                      <span 
                        className="badge"
                        style={{
                          background: `${getSeverityColor(vuln.severity)}20`,
                          color: getSeverityColor(vuln.severity)
                        }}
                      >
                        {vuln.severity}
                      </span>
                    </div>

                    <div className="vuln-section">
                      <h4>Description</h4>
                      <p>{vuln.description}</p>
                    </div>

                    <div className="vuln-section">
                      <h4>Vulnerable Code</h4>
                      <div className="code-block">
                        <pre>{vuln.codeSnippet}</pre>
                      </div>
                    </div>

                    <div className="vuln-section">
                      <h4>Remediation</h4>
                      <p>{vuln.remediation}</p>
                    </div>

                    <div className="vuln-section">
                      <h4>Fixed Code</h4>
                      <div className="code-block fixed">
                        <button 
                          className="copy-btn"
                          onClick={() => handleCopyCode(vuln.fixedCode)}
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <pre>{vuln.fixedCode}</pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'clean-code' && (
            <div className="code-section">
              <div className="code-header">
                <h2>Clean Code</h2>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleCopyCode(audit.cleanCode)}
                >
                  <Copy size={16} />
                  Copy All
                </button>
              </div>
              <div className="code-block full">
                <pre>{audit.cleanCode}</pre>
              </div>
            </div>
          )}

          {activeTab === 'original-code' && (
            <div className="code-section">
              <div className="code-header">
                <h2>Original Code</h2>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleCopyCode(audit.contractCode)}
                >
                  <Copy size={16} />
                  Copy All
                </button>
              </div>
              <div className="code-block full">
                <pre>{audit.contractCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditDetail;
