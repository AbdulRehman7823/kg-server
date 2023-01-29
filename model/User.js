const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username:{type: 'string'},
    email: { type: String, required: true, unique: true},
    password: { type: String },
    img: { type: String },
    verified: { type: Boolean,default: false },
    thirdPartyVerified: { type: Boolean, default: false},
    templates:[
        {templateId: {type: String}}
    ],
    
  },
  { timestamps: true }
);
const user = mongoose.model("User", userSchema);
module.exports = user;
