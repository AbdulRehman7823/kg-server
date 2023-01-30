const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const { verifyToken } = require("../../middlewares/authenticate");
const Contribution = require("../../model/contribution");

router.post("/:id", async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.params.id;
    var user = await User.findById(userId);
    console.log(user);
    if (!user) return res.status(422).send({ message: "User is not found" });
    const contribution = new Contribution(req.body);
    contribution.userId = userId;
    await contribution.save();
    return res.status(200).send({ message: "Your Contribution is Saved Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

router.put("/:id",async (req, res) => {
    try {
        const updatedContribution= await Contribution.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).send(updatedContribution);
      } catch (err) {
        res.status(500).send({message:err.message});
      }
})


router.get('/:id', async(req, res)=>{

    const userId = req.params.id;
    var us = await User.findById(userId);
    if(!us)
    return res.status(422).send({message:"User is not authorized"});

    const contribution = await Contribution.find({ userId: userId});
    
    return res.status(200).send(contribution);
    
});


router.delete("/:id",async (req, res) => {
  try{
    const id = req.params.id;
    const result= await Contribution.deleteOne({_id:id});
    if(result){
      return res.status(200).send({message:"Successfully Deleted"});

    }else{
      return res.status(404).send({message:"There is some Error"});
    }
  }catch(err){
    return res.status(500).send({message:console.err.message})
  }

});


router.get("/",async (req,res)=>{
  const contributions = await Contribution.find();
  return res.status(200).send(contributions);
})
module.exports = router;
