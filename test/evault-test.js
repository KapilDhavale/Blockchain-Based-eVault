const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("EVault", function () {
  // Fixture to deploy the EVault contract and set up initial state
  async function deployEVaultFixture() {
    const [owner, lawyer, client, otherAccount] = await ethers.getSigners();

    const EVault = await ethers.getContractFactory("EVault");
    const evault = await EVault.deploy();

    // Add lawyer and client as court officials
    await evault.addCourtOfficial(lawyer.address);
    await evault.addCourtOfficial(client.address);

    return { evault, owner, lawyer, client, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { evault, owner } = await loadFixture(deployEVaultFixture);
      expect(await evault.owner()).to.equal(owner.address);
    });
  });

  describe("Court Official Functions", function () {
    it("Should verify if an address is a court official", async function () {
      const { evault, lawyer, otherAccount } = await loadFixture(deployEVaultFixture);
      expect(await evault.isCourtOfficial(lawyer.address)).to.equal(true); // Changed to use isCourtOfficial
      expect(await evault.isCourtOfficial(otherAccount.address)).to.equal(false); // Changed to use isCourtOfficial
    });

    it("Should allow owner to add a court official", async function () {
      const { evault, owner, otherAccount } = await loadFixture(deployEVaultFixture);
      await evault.connect(owner).addCourtOfficial(otherAccount.address);
      expect(await evault.isCourtOfficial(otherAccount.address)).to.equal(true); // Changed to use isCourtOfficial
    });

    it("Should allow owner to remove a court official", async function () {
      const { evault, owner, lawyer } = await loadFixture(deployEVaultFixture);
      await evault.connect(owner).removeCourtOfficial(lawyer.address);
      expect(await evault.isCourtOfficial(lawyer.address)).to.equal(false); // Changed to use isCourtOfficial
    });
  });

  describe("File Upload", function () {
    it("Should upload a file successfully by a court official", async function () {
      const { evault, lawyer } = await loadFixture(deployEVaultFixture);

      await evault.connect(lawyer).uploadFile(
        "QmSomeIpfsHash",
        "Case Title",
        "2024-09-17",
        "Case123",
        "Criminal",
        "Judge Doe"
      );

      expect(await evault.totalCaseFiles()).to.equal(1);
    });

    it("Should fail if a non-court official tries to upload a file", async function () {
      const { evault, otherAccount } = await loadFixture(deployEVaultFixture);

      await expect(
        evault.connect(otherAccount).uploadFile(
          "QmSomeIpfsHash",
          "Case Title",
          "2024-09-17",
          "Case123",
          "Criminal",
          "Judge Doe"
        )
      ).to.be.revertedWith("Only court officials can upload files");
    });

    it("Should fail if required file fields are missing", async function () {
      const { evault, lawyer } = await loadFixture(deployEVaultFixture);

      await expect(
        evault.connect(lawyer).uploadFile(
          "", // Missing IPFS hash
          "Case Title",
          "2024-09-17",
          "Case123",
          "Criminal",
          "Judge Doe"
        )
      ).to.be.revertedWith("IPFS hash is required");
    });
  });

  describe("Search Functions", function () {
    it("Should return the correct case file when searching by title", async function () {
      const { evault, lawyer } = await loadFixture(deployEVaultFixture);

      await evault.connect(lawyer).uploadFile(
        "QmSomeIpfsHash",
        "Case Title",
        "2024-09-17",
        "Case123",
        "Criminal",
        "Judge Doe"
      );

      const result = await evault.searchByTitle("Case Title");
      expect(result.length).to.equal(1);
    });

    it("Should return multiple files if more than one match the search criteria", async function () {
      const { evault, lawyer } = await loadFixture(deployEVaultFixture);

      await evault.connect(lawyer).uploadFile(
        "QmSomeIpfsHash1",
        "Case Title A",
        "2024-09-17",
        "Case123",
        "Criminal",
        "Judge Doe"
      );

      await evault.connect(lawyer).uploadFile(
        "QmSomeIpfsHash2",
        "Case Title B",
        "2024-09-18",
        "Case124",
        "Civil",
        "Judge Doe"
      );

      const result = await evault.searchByTitle("Case Title A");
      expect(result.length).to.equal(1);
    });
  });
});
