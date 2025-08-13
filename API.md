# API Documentation

## Smart Contract API

The CTIRegistry smart contract provides the following functions for interacting with cyber threat intelligence data.

### Contract Address
- **Sepolia Testnet**: `[UPDATE_AFTER_DEPLOYMENT]`
- **ABI**: Available in `frontend/src/config.js`

## Core Functions

### submitCTI
Submit new cyber threat intelligence to the platform.

```solidity
function submitCTI(
    string memory _ipfsHash, 
    string memory _category,
    string memory _title
) public
```

**Parameters:**
- `_ipfsHash`: IPFS hash containing the CTI data and metadata
- `_category`: Category of the threat (e.g., "Malware", "Phishing")
- `_title`: Brief title describing the threat

**Events Emitted:**
```solidity
event CTISubmitted(
    uint256 indexed id, 
    address indexed submitter, 
    string ipfsHash, 
    string category,
    string title
);
```

**Example Usage:**
```javascript
const contract = await getContract();
const tx = await contract.submitCTI(
    "QmYourIPFSHash123",
    "Malware",
    "New Banking Trojan Detected"
);
await tx.wait();
```

### voteCTI
Vote on a CTI submission for validation.

```solidity
function voteCTI(uint256 _id, bool _isUpvote) public
```

**Parameters:**
- `_id`: CTI ID to vote on
- `_isUpvote`: `true` for upvote, `false` for downvote

**Restrictions:**
- Cannot vote on your own submissions
- Cannot vote twice on the same CTI
- CTI must be active

**Events Emitted:**
```solidity
event CTIVoted(
    uint256 indexed id, 
    address indexed validator, 
    bool isUpvote
);
```

**Example Usage:**
```javascript
const contract = await getContract();
const tx = await contract.voteCTI(1, true); // Upvote CTI #1
await tx.wait();
```

### getCTI
Retrieve CTI details by ID.

```solidity
function getCTI(uint256 _id) public view returns (CTI memory)
```

**Returns:**
```solidity
struct CTI {
    uint256 id;
    address submitter;
    string ipfsHash;
    string category;
    string title;
    uint256 timestamp;
    uint256 upvotes;
    uint256 downvotes;
    bool isActive;
}
```

**Example Usage:**
```javascript
const contract = getReadOnlyContract();
const cti = await contract.getCTI(1);
console.log(cti.title); // "New Banking Trojan Detected"
```

### getActiveCTIs
Get a list of active CTI IDs with pagination.

```solidity
function getActiveCTIs(uint256 _limit, uint256 _offset) 
    public view returns (uint256[] memory)
```

**Parameters:**
- `_limit`: Maximum number of CTIs to return (1-100)
- `_offset`: Starting offset for pagination

**Example Usage:**
```javascript
const contract = getReadOnlyContract();
const ctiIds = await contract.getActiveCTIs(20, 0); // Get first 20 CTIs
```

### getCTIScore
Get the validation score (upvotes - downvotes) for a CTI.

```solidity
function getCTIScore(uint256 _id) public view returns (int256)
```

**Example Usage:**
```javascript
const contract = getReadOnlyContract();
const score = await contract.getCTIScore(1);
console.log(`CTI #1 score: ${score}`);
```

### hasUserVoted
Check if a user has voted on a specific CTI.

```solidity
function hasUserVoted(uint256 _id, address _user) 
    public view returns (bool)
```

**Example Usage:**
```javascript
const contract = getReadOnlyContract();
const hasVoted = await contract.hasUserVoted(1, userAddress);
```

### getActiveCTICount
Get the total number of active CTIs.

```solidity
function getActiveCTICount() public view returns (uint256)
```

## IPFS Data Structure

CTI metadata stored on IPFS follows this JSON structure:

```json
{
  "title": "New Banking Trojan Detected",
  "category": "Malware",
  "description": "Detailed description of the threat...",
  "severity": "high",
  "indicators": [
    "192.168.1.100",
    "malicious-domain.com",
    "sha256:abc123..."
  ],
  "tags": ["banking", "trojan", "windows"],
  "ipfsHash": "QmFileHash123",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0"
}
```

## Frontend API Utilities

### Web3 Utilities (`utils/web3.js`)

```javascript
// Connect to MetaMask
const account = await connectWallet();

// Get contract instance
const contract = await getContract();
const readOnlyContract = getReadOnlyContract();

// Format addresses and timestamps
const shortAddress = formatAddress(fullAddress);
const readableTime = formatTimestamp(blockTimestamp);
```

### IPFS Utilities (`utils/ipfs.js`)

```javascript
// Upload file to IPFS
const cid = await uploadToIPFS(file);

// Upload JSON metadata
const metadataCid = await uploadJSONToIPFS(metadata);

// Retrieve data from IPFS
const data = await retrieveJSONFromIPFS(cid);

// Get IPFS gateway URL
const url = getIPFSUrl(cid);

// Validate file before upload
validateFile(file); // Throws error if invalid
```

## Error Handling

### Smart Contract Errors

```solidity
// Common revert messages
"CTI does not exist"
"Already voted on this CTI"
"Cannot vote on own submission"
"IPFS hash cannot be empty"
"Category cannot be empty"
"Title cannot be empty"
"Invalid limit"
```

### Frontend Error Handling

```javascript
try {
  const tx = await contract.submitCTI(ipfsHash, category, title);
  await tx.wait();
} catch (error) {
  if (error.code === 4001) {
    // User rejected transaction
    console.log('Transaction rejected by user');
  } else if (error.message.includes('insufficient funds')) {
    // Insufficient gas
    console.log('Insufficient funds for gas');
  } else {
    // Other errors
    console.error('Transaction failed:', error.message);
  }
}
```

## Rate Limits and Constraints

- **File Upload**: Maximum 10MB per file
- **Supported Formats**: JSON, TXT, PDF, CSV, XML
- **CTI Pagination**: Maximum 100 items per request
- **Gas Limits**: 
  - Submit CTI: ~100,000 gas
  - Vote: ~50,000 gas
  - Read operations: No gas cost

## Events and Monitoring

### Listening to Events

```javascript
const contract = getReadOnlyContract();

// Listen for new CTI submissions
contract.on('CTISubmitted', (id, submitter, ipfsHash, category, title) => {
  console.log(`New CTI #${id}: ${title} by ${submitter}`);
});

// Listen for votes
contract.on('CTIVoted', (id, validator, isUpvote) => {
  console.log(`CTI #${id} ${isUpvote ? 'upvoted' : 'downvoted'} by ${validator}`);
});
```

### Event Filtering

```javascript
// Get all submissions by a specific user
const filter = contract.filters.CTISubmitted(null, userAddress);
const events = await contract.queryFilter(filter);
```

## Testing

### Unit Tests

Run smart contract tests:
```bash
npm test
```

### Integration Testing

```javascript
// Example test
it('should submit and vote on CTI', async function () {
  const [owner, voter] = await ethers.getSigners();
  
  // Submit CTI
  await ctiRegistry.submitCTI("QmTest", "Malware", "Test Threat");
  
  // Vote on CTI
  await ctiRegistry.connect(voter).voteCTI(1, true);
  
  // Check results
  const cti = await ctiRegistry.getCTI(1);
  expect(cti.upvotes).to.equal(1);
});
```

## Security Considerations

1. **Input Validation**: All inputs are validated on-chain
2. **Access Control**: Users can only vote once per CTI
3. **Data Integrity**: IPFS ensures immutable data storage
4. **Gas Optimization**: Functions are optimized for gas efficiency

## Support

For API questions or issues:
- Check the smart contract source code
- Review the test files for usage examples
- Open an issue on GitHub