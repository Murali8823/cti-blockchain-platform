import { Web3Storage } from 'web3.storage';
import { WEB3_STORAGE_TOKEN } from '../config';

// Initialize Web3.Storage client
const getClient = () => {
  if (!WEB3_STORAGE_TOKEN) {
    throw new Error('Web3.Storage token not configured');
  }
  return new Web3Storage({ token: WEB3_STORAGE_TOKEN });
};

// Upload file to IPFS
export const uploadToIPFS = async (file) => {
  try {
    const client = getClient();
    
    // Create a File object with metadata
    const fileWithMetadata = new File(
      [file], 
      file.name, 
      { 
        type: file.type,
        lastModified: file.lastModified 
      }
    );
    
    const cid = await client.put([fileWithMetadata], {
      name: `CTI-${Date.now()}`,
      maxRetries: 3
    });
    
    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

// Upload JSON data to IPFS
export const uploadJSONToIPFS = async (data) => {
  try {
    const client = getClient();
    
    const jsonString = JSON.stringify(data, null, 2);
    const file = new File([jsonString], 'cti-data.json', {
      type: 'application/json'
    });
    
    const cid = await client.put([file], {
      name: `CTI-JSON-${Date.now()}`,
      maxRetries: 3
    });
    
    return cid;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
  }
};

// Get IPFS gateway URL
export const getIPFSUrl = (cid, filename = '') => {
  if (!cid) return '';
  
  // Use web3.storage gateway
  const baseUrl = `https://${cid}.ipfs.w3s.link`;
  return filename ? `${baseUrl}/${filename}` : baseUrl;
};

// Retrieve data from IPFS
export const retrieveFromIPFS = async (cid) => {
  try {
    const client = getClient();
    const res = await client.get(cid);
    
    if (!res.ok) {
      throw new Error(`Failed to retrieve from IPFS: ${res.status}`);
    }
    
    const files = await res.files();
    return files;
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
  }
};

// Retrieve JSON data from IPFS
export const retrieveJSONFromIPFS = async (cid) => {
  try {
    const files = await retrieveFromIPFS(cid);
    
    if (files.length === 0) {
      throw new Error('No files found in IPFS');
    }
    
    const file = files[0];
    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error retrieving JSON from IPFS:', error);
    throw new Error(`Failed to retrieve JSON from IPFS: ${error.message}`);
  }
};

// Validate file before upload
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/json',
    'text/plain',
    'application/pdf',
    'text/csv',
    'application/xml',
    'text/xml'
  ];
  
  if (!file) {
    throw new Error('No file selected');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not supported. Please upload JSON, TXT, PDF, CSV, or XML files.');
  }
  
  return true;
};

// Create CTI metadata object
export const createCTIMetadata = (formData, ipfsHash) => {
  return {
    title: formData.title,
    category: formData.category,
    description: formData.description,
    severity: formData.severity,
    indicators: formData.indicators || [],
    tags: formData.tags || [],
    ipfsHash: ipfsHash,
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
};