// test/DocumentStorage.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentStorage", function () {
  let DocumentStorage;
  let documentStorage;
  let owner;
  let addr1;

  beforeEach(async function () {
    DocumentStorage = await ethers.getContractFactory("DocumentStorage");
    [owner, addr1] = await ethers.getSigners();
    documentStorage = await DocumentStorage.deploy();
    await documentStorage.deployed();
  });

  it("Should upload a document", async function () {
    const tx = await documentStorage.uploadDocument("Test Document", "Qm..."); // Replace with actual IPFS hash
    await tx.wait();

    const document = await documentStorage.getDocument(1);
    expect(document.name).to.equal("Test Document");
    expect(document.ipfsHash).to.equal("Qm..."); // Replace with actual IPFS hash
    expect(document.owner).to.equal(owner.address);
  });

  it("Should get the document count", async function () {
    await documentStorage.uploadDocument("Test Document 1", "Qm...");
    await documentStorage.uploadDocument("Test Document 2", "Qm...");
    
    const count = await documentStorage.getDocumentCount();
    expect(count).to.equal(2);
  });

  it("Should retrieve a document by ID", async function () {
    await documentStorage.uploadDocument("Test Document", "Qm...");
    const document = await documentStorage.getDocument(1);
    
    expect(document.name).to.equal("Test Document");
    expect(document.ipfsHash).to.equal("Qm...");
  });
});
