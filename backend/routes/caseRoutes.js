const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const { authenticateToken } = require("../middleware/auth");

// Routes for case management
router.post("/create", caseController.createCase);
router.get("/lawyer", authenticateToken, caseController.getLawyerCases);
router.get("/client", authenticateToken, caseController.getClientCases);
router.get("/:caseId",authenticateToken, caseController.getCaseDetails);

module.exports = router;
