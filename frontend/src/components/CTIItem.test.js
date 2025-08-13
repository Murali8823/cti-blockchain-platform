import { render, screen, fireEvent } from '@testing-library/react';
import CTIFeed from './CTIFeed';

// Mock the web3 utilities
jest.mock('../utils/web3', () => ({
  getReadOnlyContract: jest.fn(),
  getContract: jest.fn(),
  formatAddress: jest.fn((addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`),
  formatTimestamp: jest.fn((ts) => new Date(ts * 1000).toLocaleString())
}));

// Mock the IPFS utilities
jest.mock('../utils/ipfs', () => ({
  getIPFSUrl: jest.fn((cid) => `https://${cid}.ipfs.w3s.link`),
  retrieveJSONFromIPFS: jest.fn()
}));

describe('CTIFeed Component', () => {
  const mockAccount = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<CTIFeed account={mockAccount} />);
    expect(screen.getByText('Loading CTI feed...')).toBeInTheDocument();
  });

  test('renders empty state when no CTI reports', async () => {
    const { getReadOnlyContract } = require('../utils/web3');
    getReadOnlyContract.mockReturnValue({
      getActiveCTIs: jest.fn().mockResolvedValue([])
    });

    render(<CTIFeed account={mockAccount} />);
    
    // Wait for loading to complete
    await screen.findByText('No CTI reports found');
    expect(screen.getByText('Be the first to submit a threat intelligence report!')).toBeInTheDocument();
  });
});