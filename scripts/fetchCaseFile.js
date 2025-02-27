const { ethers } = require("hardhat");
require("dotenv").config();

async function fetchCaseFiles() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Hardhat local node
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Fetching case files with the account:", deployer.address);

  const NavinEvault = await ethers.getContractFactory("NavinEvault", deployer);
  const contract = await NavinEvault.attach(process.env.NAVINEVAULT_CONTRACT_ADDRESS);

  try {
    const totalFiles = await contract.totalCaseFiles();
    console.log(`Total case files: ${totalFiles.toString()}`);

    if (totalFiles === 0n) {  // Fix: Use '0n' for BigInt comparison
      console.log("No case files exist. Please upload a case file before fetching.");
      return { message: "No case files exist." };
    }

    const allCaseFiles = [];

    for (let i = 0; i < totalFiles; i++) { // Assuming 0-based indexing
      const caseFile = await contract.getFile(i);
      console.log(`Fetching case file ${i}:`, caseFile);

      const caseFileData = {
        caseNumber: caseFile.caseNumber.toString(),
        title: caseFile.title || "N/A",
        ipfsHash: caseFile.ipfsHash || null,
        dateOfJudgment: caseFile.dateOfJudgment || "N/A",
        category: caseFile.category || "N/A",
        judgeName: caseFile.judgeName || "N/A",
        linkedClients: caseFile.linkedClients || [],
        metadata: {
          uploader: caseFile.uploader || "N/A",
          timestamp: caseFile.timestamp.toString() || "N/A",
        },
      };

      allCaseFiles.push(caseFileData);
    }

    console.log("All case files retrieved:", allCaseFiles);
    return { message: "Case files retrieved successfully", files: allCaseFiles };
  } catch (error) {
    console.error("Error fetching case files:", error);
    throw error;
  }
}

fetchCaseFiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
