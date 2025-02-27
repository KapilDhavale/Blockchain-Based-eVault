const express = require("express");
const { ethers } = require("hardhat");
const { authenticateToken } = require("../middleware/auth");
const FileMetadata = require("../models/FileMetadata");

const router = express.Router();

// GET /files - retrieve all uploaded case files from the smart contract
router.get("/", authenticateToken, async (req, res) => {
  const [deployer] = await ethers.getSigners();
  console.log("Fetching case files with the account:", deployer.address);

  const NavinEvault = await ethers.getContractFactory("NavinEvault");
  const contract = await NavinEvault.attach(process.env.NAVINEVAULT_CONTRACT_ADDRESS);

  try {
    const totalFiles = await contract.totalCaseFiles();
    console.log(`Total case files: ${totalFiles.toString()}`);

    if (totalFiles.isZero()) {
      return res.status(404).json({ message: "No case files exist." });
    }

    const allCaseFiles = [];
    for (let i = 1; i <= totalFiles; i++) {
      const caseFile = await contract.getFile(i);
      const caseFileData = {
        caseNumber: caseFile.caseNumber.toString(),
        title: caseFile.title || "N/A",
        ipfsHash: caseFile.ipfsHash || null, // crucial data retrieved from blockchain
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

    res.json({
      message: "Case files retrieved successfully",
      files: allCaseFiles,
    });
  } catch (error) {
    console.error("Error retrieving case files:", error);
    res.status(500).json({ message: "Error fetching case files", error: error.message });
  }
});

// GET /files/metadata/:filename - retrieve metadata for a specific file from MongoDB
router.get("/metadata/:filename", authenticateToken, async (req, res) => {
  const filename = req.params.filename;
  console.log("Requested filename:", filename);

  try {
    // Query MongoDB for the file metadata by the original file name
    const metadata = await FileMetadata.findOne({ originalname: filename });
    if (metadata) {
      res.json({
        message: "Metadata retrieved successfully",
        metadata,
      });
    } else {
      console.error("Metadata not found for:", filename);
      res.status(404).json({ message: "Metadata not found for the specified file" });
    }
  } catch (err) {
    console.error("Error fetching metadata:", err);
    res.status(500).json({ message: "Error fetching metadata", error: err.message });
  }
});

module.exports = router;
