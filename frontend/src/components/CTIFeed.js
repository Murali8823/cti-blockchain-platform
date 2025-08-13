import React, { useState, useEffect } from 'react';
import { getReadOnlyContract, getContract, formatAddress, formatTimestamp } from '../utils/web3';
import { getIPFSUrl, retrieveJSONFromIPFS } from '../utils/ipfs';

const CTIFeed = ({ account }) => {
  const [ctiList, setCtiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadCTIFeed();
  }, []);

  const loadCTIFeed = async () => {
    try {
      setLoading(true);
      const contract = getReadOnlyContract();
      
      // Get active CTI IDs
      const ctiIds = await contract.getActiveCTIs(20, 0);
      
      // Load CTI details
      const ctiPromises = ctiIds.map(async (id) => {
        try {
          const cti = await contract.getCTI(id);
          const score = await contract.getCTIScore(id);
          const hasVoted = account ? await contract.hasUserVoted(id, account) : false;
          
          // Try to load metadata from IPFS
          let metadata = null;
          try {
            metadata = await retrieveJSONFromIPFS(cti.ipfsHash);
          } catch (error) {
            console.warn(`Failed to load metadata for CTI ${id}:`, error);
          }
          
          return {
            id: Number(cti.id),
            submitter: cti.submitter,
            ipfsHash: cti.ipfsHash,
            category: cti.category,
            title: cti.title,
            timestamp: Number(cti.timestamp),
            upvotes: Number(cti.upvotes),
            downvotes: Number(cti.downvotes),
            score: Number(score),
            hasVoted,
            metadata
          };
        } catch (error) {
          console.error(`Error loading CTI ${id}:`, error);
          return null;
        }
      });
      
      const ctiData = (await Promise.all(ctiPromises)).filter(Boolean);
      setCtiList(ctiData);
      
    } catch (error) {
      console.error('Error loading CTI feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ctiId, isUpvote) => {
    try {
      setVoting(prev => ({ ...prev, [ctiId]: true }));
      
      const contract = await getContract();
      const tx = await contract.voteCTI(ctiId, isUpvote);
      await tx.wait();
      
      // Reload the feed to get updated vote counts
      await loadCTIFeed();
      
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote: ' + error.message);
    } finally {
      setVoting(prev => ({ ...prev, [ctiId]: false }));
    }
  };

  const toggleExpanded = (ctiId) => {
    setExpandedItems(prev => ({
      ...prev,
      [ctiId]: !prev[ctiId]
    }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Malware': '#dc3545',
      'Phishing': '#fd7e14',
      'Ransomware': '#6f42c1',
      'APT': '#e83e8c',
      'Vulnerability': '#ffc107',
      'Botnet': '#20c997',
      'DDoS': '#17a2b8',
      'Data Breach': '#6c757d',
      'Social Engineering': '#28a745',
      'Other': '#007bff'
    };
    return colors[category] || '#6c757d';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'low': '#28a745',
      'medium': '#ffc107',
      'high': '#fd7e14',
      'critical': '#dc3545'
    };
    return colors[severity] || '#6c757d';
  };

  const filteredAndSortedCTI = ctiList
    .filter(cti => {
      if (filter === 'all') return true;
      if (filter === 'my-submissions') return cti.submitter.toLowerCase() === account.toLowerCase();
      return cti.category === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'most-voted':
          return (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes);
        case 'highest-score':
          return b.score - a.score;
        default:
          return b.timestamp - a.timestamp;
      }
    });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading CTI feed...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Cyber Threat Intelligence Feed</h2>
          <p>Community-validated threat intelligence reports</p>
        </div>

        {/* Filters and Sorting */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <label className="form-label">Filter by:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="all">All Categories</option>
              <option value="my-submissions">My Submissions</option>
              <option value="Malware">Malware</option>
              <option value="Phishing">Phishing</option>
              <option value="Ransomware">Ransomware</option>
              <option value="APT">APT</option>
              <option value="Vulnerability">Vulnerability</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-voted">Most Voted</option>
              <option value="highest-score">Highest Score</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Showing {filteredAndSortedCTI.length} of {ctiList.length} reports
        </div>
      </div>

      {filteredAndSortedCTI.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No CTI reports found</h3>
          <p>Be the first to submit a threat intelligence report!</p>
        </div>
      ) : (
        filteredAndSortedCTI.map((cti) => (
          <div key={cti.id} className="cti-item">
            <div className="cti-header">
              <div>
                <h3 className="cti-title">{cti.title}</h3>
                <div className="cti-meta">
                  <span>ID: #{cti.id}</span>
                  <span>By: {formatAddress(cti.submitter)}</span>
                  <span>{formatTimestamp(cti.timestamp)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span 
                  className="cti-category"
                  style={{ backgroundColor: getCategoryColor(cti.category) }}
                >
                  {cti.category}
                </span>
                {cti.metadata?.severity && (
                  <span 
                    className="cti-category"
                    style={{ backgroundColor: getSeverityColor(cti.metadata.severity) }}
                  >
                    {cti.metadata.severity.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {cti.metadata?.description && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#666', lineHeight: '1.5' }}>
                  {expandedItems[cti.id] 
                    ? cti.metadata.description 
                    : `${cti.metadata.description.substring(0, 200)}${cti.metadata.description.length > 200 ? '...' : ''}`
                  }
                </p>
                {cti.metadata.description.length > 200 && (
                  <button
                    onClick={() => toggleExpanded(cti.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#667eea', 
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    {expandedItems[cti.id] ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}

            {/* Indicators and Tags */}
            {expandedItems[cti.id] && cti.metadata && (
              <div style={{ marginBottom: '1rem' }}>
                {cti.metadata.indicators && cti.metadata.indicators.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Indicators of Compromise:</strong>
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: '0.5rem', 
                      borderRadius: '4px', 
                      marginTop: '0.5rem',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }}>
                      {cti.metadata.indicators.slice(0, 5).map((indicator, index) => (
                        <div key={index}>{indicator}</div>
                      ))}
                      {cti.metadata.indicators.length > 5 && (
                        <div style={{ color: '#666' }}>
                          ... and {cti.metadata.indicators.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {cti.metadata.tags && cti.metadata.tags.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Tags:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      {cti.metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#e9ecef',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            marginRight: '0.5rem',
                            marginBottom: '0.5rem',
                            display: 'inline-block'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* IPFS Link */}
            <div style={{ marginBottom: '1rem' }}>
              <a
                href={getIPFSUrl(cti.ipfsHash)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}
              >
                📎 View on IPFS
              </a>
            </div>

            {/* Voting */}
            <div className="cti-voting">
              <button
                className={`vote-button ${cti.hasVoted ? 'voted' : ''}`}
                onClick={() => handleVote(cti.id, true)}
                disabled={voting[cti.id] || cti.hasVoted || cti.submitter.toLowerCase() === account.toLowerCase()}
              >
                👍 {cti.upvotes}
              </button>
              
              <button
                className={`vote-button ${cti.hasVoted ? 'voted' : ''}`}
                onClick={() => handleVote(cti.id, false)}
                disabled={voting[cti.id] || cti.hasVoted || cti.submitter.toLowerCase() === account.toLowerCase()}
              >
                👎 {cti.downvotes}
              </button>
              
              <div style={{ 
                padding: '0.5rem 1rem', 
                background: cti.score >= 0 ? '#d4edda' : '#f8d7da',
                color: cti.score >= 0 ? '#155724' : '#721c24',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}>
                Score: {cti.score > 0 ? '+' : ''}{cti.score}
              </div>
              
              {voting[cti.id] && (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              )}
            </div>

            {cti.submitter.toLowerCase() === account.toLowerCase() && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.5rem', 
                background: '#fff3cd', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: '#856404'
              }}>
                📝 This is your submission
              </div>
            )}
          </div>
        ))
      )}

      {filteredAndSortedCTI.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={loadCTIFeed}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Feed'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CTIFeed;