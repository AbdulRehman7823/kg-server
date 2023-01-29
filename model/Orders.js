const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    price: { type: Number },
    cleared: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
