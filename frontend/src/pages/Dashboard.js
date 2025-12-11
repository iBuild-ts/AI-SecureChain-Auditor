import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { Plus, Download, Eye, Trash2, FileText } from 'lucide-react';
import './Dashboard.css';

function Dashboard({ user }) {
  const [audits, setAudits] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contractName, setContractName] = useState('');
  const [contractCode, setContractCode] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAudits();
    fetchStats();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await axios.get('/api/audits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAudits(response.data);
    } catch (err) {
      console.error('Error fetching audits:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/user/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreateAudit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/audits/create',
        { contractName, contractCode, chain },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Audit completed successfully!');
      setContractName('');
      setContractCode('');
      setChain('ethereum');
      setShowCreateForm(false);

      setTimeout(() => {
        fetchAudits();
        fetchStats();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Audit creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (auditId) => {
    try {
      await axios.post(
        `/api/audits/${auditId}/generate-report`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Report generated successfully!');
      setTimeout(() => fetchAudits(), 500);
    } catch (err) {
      setError('Failed to generate report');
    }
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

  const getRatingStars = (rating) => {
    if (!rating) return '—';
    return '⭐'.repeat(Math.round(rating));
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted">Welcome back, {user?.name}!</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={18} />
            New Audit
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Audits</div>
              <div className="stat-value">{stats.totalAudits}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Vulnerabilities Found</div>
              <div className="stat-value">{stats.vulnerabilitiesFound}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average Rating</div>
              <div className="stat-value">{stats.averageRating}/5</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Current Tier</div>
              <div className="stat-value capitalize">{stats.tier}</div>
            </div>
          </div>
        )}

        {/* Create Audit Form */}
        {showCreateForm && (
          <div className="card create-form">
            <h2>Create New Audit</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <form onSubmit={handleCreateAudit}>
              <div className="input-group">
                <label>Contract Name</label>
                <input
                  type="text"
                  placeholder="e.g., MyToken, StakingPool"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Blockchain Network</label>
                <select value={chain} onChange={(e) => setChain(e.target.value)}>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="bsc">Binance Smart Chain</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="optimism">Optimism</option>
                </select>
              </div>

              <div className="input-group">
                <label>Smart Contract Code (Solidity)</label>
                <textarea
                  placeholder="Paste your Solidity contract code here..."
                  value={contractCode}
                  onChange={(e) => setContractCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner"></span> : null}
                  {loading ? 'Analyzing...' : 'Start Audit'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Audits List */}
        <div className="audits-section">
          <h2>Recent Audits</h2>
          {audits.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No audits yet</h3>
              <p>Create your first audit to get started with SecureChain Auditor</p>
            </div>
          ) : (
            <div className="audits-table">
              <div className="table-header">
                <div className="col-name">Contract</div>
                <div className="col-chain">Chain</div>
                <div className="col-vulns">Vulnerabilities</div>
                <div className="col-rating">Pre / Post Rating</div>
                <div className="col-date">Date</div>
                <div className="col-actions">Actions</div>
              </div>

              {audits.map((audit) => (
                <div key={audit._id} className="table-row">
                  <div className="col-name">
                    <strong>{audit.contractName}</strong>
                  </div>
                  <div className="col-chain">
                    <span className="badge badge-medium">{audit.chain}</span>
                  </div>
                  <div className="col-vulns">
                    <div className="vuln-badges">
                      {audit.vulnerabilities.filter(v => v.severity === 'Critical').length > 0 && (
                        <span className="badge badge-critical">
                          C: {audit.vulnerabilities.filter(v => v.severity === 'Critical').length}
                        </span>
                      )}
                      {audit.vulnerabilities.filter(v => v.severity === 'High').length > 0 && (
                        <span className="badge badge-high">
                          H: {audit.vulnerabilities.filter(v => v.severity === 'High').length}
                        </span>
                      )}
                      {audit.vulnerabilities.filter(v => v.severity === 'Medium').length > 0 && (
                        <span className="badge badge-medium">
                          M: {audit.vulnerabilities.filter(v => v.severity === 'Medium').length}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-rating">
                    <div className="rating-display">
                      <span>{getRatingStars(audit.preAuditRating)}</span>
                      <span className="text-muted">/</span>
                      <span>{getRatingStars(audit.postAuditRating)}</span>
                    </div>
                  </div>
                  <div className="col-date">
                    {new Date(audit.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-actions">
                    <Link to={`/audit/${audit._id}`} className="btn btn-sm btn-primary">
                      <Eye size={14} />
                    </Link>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleGenerateReport(audit._id)}
                    >
                      <FileText size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
