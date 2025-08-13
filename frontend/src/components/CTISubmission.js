import React, { useState } from 'react';
import { getContract } from '../utils/web3';
import { uploadToIPFS, uploadJSONToIPFS, validateFile, createCTIMetadata } from '../utils/ipfs';

const CTISubmission = ({ account }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    severity: 'medium',
    indicators: '',
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const categories = [
    'Malware',
    'Phishing',
    'Ransomware',
    'APT',
    'Vulnerability',
    'Botnet',
    'DDoS',
    'Data Breach',
    'Social Engineering',
    'Other'
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: '#28a745' },
    { value: 'medium', label: 'Medium', color: '#ffc107' },
    { value: 'high', label: 'High', color: '#fd7e14' },
    { value: 'critical', label: 'Critical', color: '#dc3545' }
  ];

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile) {
      try {
        validateFile(selectedFile);
        setFile(selectedFile);
        showAlert('success', `File "${selectedFile.name}" selected successfully`);
      } catch (error) {
        showAlert('error', error.message);
        setFile(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      throw new Error('Title is required');
    }
    if (!formData.category) {
      throw new Error('Category is required');
    }
    if (!formData.description.trim()) {
      throw new Error('Description is required');
    }
    if (!file) {
      throw new Error('Please select a file to upload');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form
      validateForm();

      // Process indicators and tags
      const indicators = formData.indicators
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Upload file to IPFS
      showAlert('info', 'Uploading file to IPFS...');
      const fileCid = await uploadToIPFS(file);

      // Create metadata and upload to IPFS
      const metadata = createCTIMetadata({
        ...formData,
        indicators,
        tags
      }, fileCid);

      showAlert('info', 'Uploading metadata to IPFS...');
      const metadataCid = await uploadJSONToIPFS(metadata);

      // Submit to blockchain
      showAlert('info', 'Submitting to blockchain...');
      const contract = await getContract();
      const tx = await contract.submitCTI(metadataCid, formData.category, formData.title);
      
      showAlert('info', 'Waiting for transaction confirmation...');
      await tx.wait();

      showAlert('success', 'CTI submitted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        severity: 'medium',
        indicators: '',
        tags: ''
      });
      setFile(null);

    } catch (error) {
      console.error('Error submitting CTI:', error);
      showAlert('error', error.message || 'Failed to submit CTI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Submit Cyber Threat Intelligence</h2>
        <p>Share threat intelligence with the community for validation</p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Brief title describing the threat"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Severity Level</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleInputChange}
            className="form-select"
          >
            {severityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Detailed description of the threat, attack vectors, impact, etc."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Indicators of Compromise (IoCs)</label>
          <textarea
            name="indicators"
            value={formData.indicators}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="One indicator per line (IPs, domains, hashes, etc.)"
            rows="3"
          />
          <small style={{ color: '#666', fontSize: '0.9rem' }}>
            Enter one indicator per line (e.g., IP addresses, domain names, file hashes)
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Comma-separated tags (e.g., banking, trojan, windows)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Upload File *</label>
          <div
            className={`file-input ${dragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".json,.txt,.pdf,.csv,.xml"
              style={{ display: 'none' }}
            />
            {file ? (
              <div>
                <p>✅ {file.name}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p>📁 Click to select or drag & drop a file</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Supported: JSON, TXT, PDF, CSV, XML (max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', fontSize: '1.1rem' }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}></div>
              Submitting...
            </>
          ) : (
            'Submit CTI Report'
          )}
        </button>
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>How it works:</h4>
        <ol style={{ marginLeft: '1rem', color: '#666' }}>
          <li>Your file is uploaded to IPFS for decentralized storage</li>
          <li>Metadata is stored on the Ethereum blockchain</li>
          <li>Community members can vote to validate your submission</li>
          <li>High-quality submissions gain credibility through voting</li>
        </ol>
      </div>
    </div>
  );
};

export default CTISubmission;