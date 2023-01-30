const mongoose = require("mongoose");
require("dotenv").config();
const userSchema = mongoose.Schema(
  {
    username: { type: "string" },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    accountId: { type: String },
    img: { type: String },
    verified: { type: Boolean, default: false },
    thirdPartyVerified: { type: Boolean, default: false },
    templates: [{ templateId: { type: String } }],
    withdrawEarning: { type: Number, default: 0 },
    totalSales:{type: Number, default:0}
  },
  { timestamps: true }
);
const user = mongoose.model("User", userSchema);
module.exports = user;
