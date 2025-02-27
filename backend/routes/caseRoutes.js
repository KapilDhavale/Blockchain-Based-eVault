const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const { authenticateToken } = require("../middleware/auth");

// Routes for case management
router.post("/create", caseController.createCase);
router.get("/lawyer", authenticateToken, caseController.getLawyerCases);
router.get("/client", authenticateToken, caseController.getClientCases);
router.get("/:caseId", authenticateToken, caseController.getCaseDetails);

// New route to get all cases (if needed)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cases = await require("../models/Case").find().populate(["lawyer", "client"]);
    res.status(200).json(cases);
  } catch (error) {
    console.error("Error retrieving all cases:", error);
    res.status(500).json({ message: "Failed to retrieve cases" });
  }
});

module.exports = router;
