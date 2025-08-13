const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CTIRegistry", function () {
  let CTIRegistry;
  let ctiRegistry;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get contract factory and signers
    CTIRegistry = await ethers.getContractFactory("CTIRegistry");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    ctiRegistry = await CTIRegistry.deploy();
    await ctiRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the initial CTI counter to 0", async function () {
      expect(await ctiRegistry.ctiCounter()).to.equal(0);
    });

    it("Should have zero active CTIs initially", async function () {
      expect(await ctiRegistry.getActiveCTICount()).to.equal(0);
    });
  });

  describe("CTI Submission", function () {
    it("Should submit a new CTI successfully", async function () {
      const ipfsHash = "QmTestHash123";
      const category = "Malware";
      const title = "Test Threat Report";

      await expect(ctiRegistry.submitCTI(ipfsHash, category, title))
        .to.emit(ctiRegistry, "CTISubmitted")
        .withArgs(1, owner.address, ipfsHash, category, title);

      expect(await ctiRegistry.ctiCounter()).to.equal(1);
      
      const cti = await ctiRegistry.getCTI(1);
      expect(cti.id).to.equal(1);
      expect(cti.submitter).to.equal(owner.address);
      expect(cti.ipfsHash).to.equal(ipfsHash);
      expect(cti.category).to.equal(category);
      expect(cti.title).to.equal(title);
      expect(cti.upvotes).to.equal(0);
      expect(cti.downvotes).to.equal(0);
      expect(cti.isActive).to.equal(true);
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(ctiRegistry.submitCTI("", "Malware", "Test"))
        .to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("Should reject empty category", async function () {
      await expect(ctiRegistry.submitCTI("QmTestHash", "", "Test"))
        .to.be.revertedWith("Category cannot be empty");
    });

    it("Should reject empty title", async function () {
      await expect(ctiRegistry.submitCTI("QmTestHash", "Malware", ""))
        .to.be.revertedWith("Title cannot be empty");
    });

    it("Should increment user submission count", async function () {
      await ctiRegistry.submitCTI("QmTestHash1", "Malware", "Test 1");
      await ctiRegistry.submitCTI("QmTestHash2", "Phishing", "Test 2");
      
      expect(await ctiRegistry.userSubmissions(owner.address)).to.equal(2);
    });
  });

  describe("CTI Voting", function () {
    beforeEach(async function () {
      // Submit a CTI for testing
      await ctiRegistry.submitCTI("QmTestHash", "Malware", "Test Threat");
    });

    it("Should allow upvoting a CTI", async function () {
      await expect(ctiRegistry.connect(addr1).voteCTI(1, true))
        .to.emit(ctiRegistry, "CTIVoted")
        .withArgs(1, addr1.address, true);

      const cti = await ctiRegistry.getCTI(1);
      expect(cti.upvotes).to.equal(1);
      expect(cti.downvotes).to.equal(0);
    });

    it("Should allow downvoting a CTI", async function () {
      await expect(ctiRegistry.connect(addr1).voteCTI(1, false))
        .to.emit(ctiRegistry, "CTIVoted")
        .withArgs(1, addr1.address, false);

      const cti = await ctiRegistry.getCTI(1);
      expect(cti.upvotes).to.equal(0);
      expect(cti.downvotes).to.equal(1);
    });

    it("Should prevent double voting", async function () {
      await ctiRegistry.connect(addr1).voteCTI(1, true);
      
      await expect(ctiRegistry.connect(addr1).voteCTI(1, false))
        .to.be.revertedWith("Already voted on this CTI");
    });

    it("Should prevent submitter from voting on own CTI", async function () {
      await expect(ctiRegistry.voteCTI(1, true))
        .to.be.revertedWith("Cannot vote on own submission");
    });

    it("Should reject voting on non-existent CTI", async function () {
      await expect(ctiRegistry.connect(addr1).voteCTI(999, true))
        .to.be.revertedWith("CTI does not exist");
    });
  });

  describe("CTI Retrieval", function () {
    beforeEach(async function () {
      // Submit multiple CTIs for testing
      await ctiRegistry.submitCTI("QmHash1", "Malware", "Threat 1");
      await ctiRegistry.submitCTI("QmHash2", "Phishing", "Threat 2");
      await ctiRegistry.submitCTI("QmHash3", "Ransomware", "Threat 3");
    });

    it("Should get active CTIs with pagination", async function () {
      const activeCTIs = await ctiRegistry.getActiveCTIs(2, 0);
      expect(activeCTIs.length).to.equal(2);
      expect(activeCTIs[0]).to.equal(3); // Most recent first
      expect(activeCTIs[1]).to.equal(2);
    });

    it("Should get active CTIs with offset", async function () {
      const activeCTIs = await ctiRegistry.getActiveCTIs(2, 1);
      expect(activeCTIs.length).to.equal(2);
      expect(activeCTIs[0]).to.equal(2);
      expect(activeCTIs[1]).to.equal(1);
    });

    it("Should return correct active CTI count", async function () {
      expect(await ctiRegistry.getActiveCTICount()).to.equal(3);
    });

    it("Should calculate CTI score correctly", async function () {
      // Add some votes
      await ctiRegistry.connect(addr1).voteCTI(1, true);  // +1
      await ctiRegistry.connect(addr2).voteCTI(1, true);  // +1
      
      expect(await ctiRegistry.getCTIScore(1)).to.equal(2);
      
      // Add a downvote
      await ctiRegistry.connect(addr1).voteCTI(2, false); // -1
      expect(await ctiRegistry.getCTIScore(2)).to.equal(-1);
    });

    it("Should check if user has voted", async function () {
      expect(await ctiRegistry.hasUserVoted(1, addr1.address)).to.equal(false);
      
      await ctiRegistry.connect(addr1).voteCTI(1, true);
      
      expect(await ctiRegistry.hasUserVoted(1, addr1.address)).to.equal(true);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle limit validation for getActiveCTIs", async function () {
      await expect(ctiRegistry.getActiveCTIs(0, 0))
        .to.be.revertedWith("Invalid limit");
      
      await expect(ctiRegistry.getActiveCTIs(101, 0))
        .to.be.revertedWith("Invalid limit");
    });

    it("Should handle empty results gracefully", async function () {
      const activeCTIs = await ctiRegistry.getActiveCTIs(10, 0);
      expect(activeCTIs.length).to.equal(0);
    });
  });
});