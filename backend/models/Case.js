const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
  {
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caseTitle: { type: String, required: true },
    summary: { type: String },
    caseType: {
      type: String,
      enum: ["Civil", "Criminal", "Family", "Corporate"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "In Progress"],
      default: "Open",
    },
    filingDate: { type: Date, default: Date.now },
    partiesInvolved: {
      opposingPartyName: { type: String },
      opposingCounsel: { type: String },
      opposingContact: { type: String },
    },
    courtDetails: {
      courtName: { type: String },
      judgeName: { type: String },
    },
    importantDates: [{ type: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", CaseSchema);
