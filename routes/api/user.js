const express = require("express");
const router = express.Router();
const User = require("../../model/User");

router.get('/:id', async (req, res) => {
  const id =  req.params.id;
  const user =  await User.findById(id);
  if(!user)
  return res.status(422).send({ message:"user not found" });

  return res.status(200).send(user);
})
module.exports = router;