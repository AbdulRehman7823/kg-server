const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const Order = require("../../model/Orders");

router.get('/:id', async (req, res) => {
  const id =  req.params.id;
  const user =  await User.findById(id);
  if(!user)
  return res.status(422).send({ message:"user not found" });

  const transactions = await Order.find({receiverId:id});
  if(!transactions)
    return res.status(422).send({ message:"Transactions not found" });
  return res.status(200).send(transactions);
})

module.exports = router;