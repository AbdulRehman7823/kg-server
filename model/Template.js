const mongoose = require("mongoose");

const templateSchema = mongoose.Schema(
  {
    siteName: { type: String, required: true, unique: true },
    siteDescription: { type: String, required: true },
    siteSourceCode: { type: String, required: true },
    siteImage: { type: String, required: true },
    siteUrl: { type: String },
    userId:{ type: String},
    price: { type: Number, default:0},
    
  },
  { timestamps: true }
);
const Template = mongoose.model("Template", templateSchema);
module.exports = Template;
