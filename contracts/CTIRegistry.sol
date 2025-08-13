// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CTIRegistry
 * @dev Smart contract for managing cyber threat intelligence submissions and validation
 */
contract CTIRegistry {
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

    // State variables
    uint256 public ctiCounter = 0;
    mapping(uint256 => CTI) public ctiRecords;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256) public userSubmissions;
    
    // Events
    event CTISubmitted(
        uint256 indexed id, 
        address indexed submitter, 
        string ipfsHash, 
        string category,
        string title
    );
    
    event CTIVoted(
        uint256 indexed id, 
        address indexed validator, 
        bool isUpvote
    );
    
    event CTIDeactivated(uint256 indexed id);

    // Modifiers
    modifier validCTI(uint256 _id) {
        require(_id > 0 && _id <= ctiCounter, "CTI does not exist");
        require(ctiRecords[_id].isActive, "CTI is not active");
        _;
    }

    modifier hasNotVoted(uint256 _id) {
        require(!hasVoted[_id][msg.sender], "Already voted on this CTI");
        _;
    }

    /**
     * @dev Submit new cyber threat intelligence
     * @param _ipfsHash IPFS hash of the CTI data
     * @param _category Category of the threat
     * @param _title Title/summary of the CTI
     */
    function submitCTI(
        string memory _ipfsHash, 
        string memory _category,
        string memory _title
    ) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");

        ctiCounter++;
        ctiRecords[ctiCounter] = CTI({
            id: ctiCounter,
            submitter: msg.sender,
            ipfsHash: _ipfsHash,
            category: _category,
            title: _title,
            timestamp: block.timestamp,
            upvotes: 0,
            downvotes: 0,
            isActive: true
        });

        userSubmissions[msg.sender]++;

        emit CTISubmitted(ctiCounter, msg.sender, _ipfsHash, _category, _title);
    }

    /**
     * @dev Vote on a CTI submission
     * @param _id CTI ID to vote on
     * @param _isUpvote True for upvote, false for downvote
     */
    function voteCTI(uint256 _id, bool _isUpvote) 
        public 
        validCTI(_id) 
        hasNotVoted(_id) 
    {
        require(ctiRecords[_id].submitter != msg.sender, "Cannot vote on own submission");

        hasVoted[_id][msg.sender] = true;
        
        if (_isUpvote) {
            ctiRecords[_id].upvotes++;
        } else {
            ctiRecords[_id].downvotes++;
        }

        emit CTIVoted(_id, msg.sender, _isUpvote);
    }

    /**
     * @dev Get CTI details by ID
     * @param _id CTI ID
     * @return CTI struct
     */
    function getCTI(uint256 _id) public view validCTI(_id) returns (CTI memory) {
        return ctiRecords[_id];
    }

    /**
     * @dev Get all active CTI IDs (for pagination, limit to recent ones)
     * @param _limit Maximum number of CTIs to return
     * @param _offset Starting offset
     * @return Array of CTI IDs
     */
    function getActiveCTIs(uint256 _limit, uint256 _offset) 
        public 
        view 
        returns (uint256[] memory) 
    {
        require(_limit > 0 && _limit <= 100, "Invalid limit");
        
        uint256[] memory activeCTIs = new uint256[](_limit);
        uint256 count = 0;
        uint256 currentOffset = 0;

        // Start from most recent and work backwards
        for (uint256 i = ctiCounter; i > 0 && count < _limit; i--) {
            if (ctiRecords[i].isActive) {
                if (currentOffset >= _offset) {
                    activeCTIs[count] = i;
                    count++;
                }
                currentOffset++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeCTIs[i];
        }

        return result;
    }

    /**
     * @dev Get CTI validation score (upvotes - downvotes)
     * @param _id CTI ID
     * @return Validation score
     */
    function getCTIScore(uint256 _id) public view validCTI(_id) returns (int256) {
        CTI memory cti = ctiRecords[_id];
        return int256(cti.upvotes) - int256(cti.downvotes);
    }

    /**
     * @dev Check if user has voted on a specific CTI
     * @param _id CTI ID
     * @param _user User address
     * @return True if user has voted
     */
    function hasUserVoted(uint256 _id, address _user) public view returns (bool) {
        return hasVoted[_id][_user];
    }

    /**
     * @dev Get total number of active CTIs
     * @return Number of active CTIs
     */
    function getActiveCTICount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= ctiCounter; i++) {
            if (ctiRecords[i].isActive) {
                count++;
            }
        }
        return count;
    }
}