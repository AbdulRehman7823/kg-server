const mongoose = require("mongoose");

const contributionSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    userId:{ type: String},
  },
  { timestamps: true }
);
const Contribution = mongoose.model("Contribution", contributionSchema);
module.exports = Contribution;
