const mongoose = require("mongoose");

const templateSchema = mongoose.Schema(
  {
    siteId:{type: String},
    siteName: { type: String, required: true, unique: true },
    siteDescription: { type: String, required: true },
    siteSourceCode: { type: String },
    siteImage: { type: String },
    siteUrl: { type: String },
    userId:{ type: String},
    sitePrice: { type: Number, default:0},
    
  },
  { timestamps: true }
);
const Template = mongoose.model("Template", templateSchema);
module.exports = Template;
