const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const { verifyToken } = require("../../middlewares/authenticate");
const Template = require("../../model/Template");

router.post("/:id", async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.params.id;
    var user = await User.findById(userId);
    console.log(user);
    if (!user) return res.status(422).send({ message: "User is not found" });
    const template = new Template(req.body);
    template.userId = userId;
    await template.save();
    return res.status(200).send({ message: "Your Site is Saved Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
});

router.put("/:id",async (req, res) => {
    try {
        const updatedTemplate= await Template.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).send(updatedTemplate);
      } catch (err) {
        res.status(500).send({message:err.message});
      }
})

router.get('/template/:id',async (req, res) => {
  const id = req.params.id;
  const template = await Template.findById(id);
  if(!template)
  return res.status(404).send({ message:"There is no Template with this ID." });

  return res.status(200).send(template);

});

router.get('/:id', async(req, res)=>{

    const userId = req.params.id;
    var us = await User.findById(userId);
    console.log(us);
    if(!us)
    return res.status(422).send({message:"User is not authorized"});

    const templates = await Template.find({ userId: userId});
    
    return res.status(200).send(templates);
    
});


router.delete("/:id",async (req, res) => {
  try{
    const id = req.params.id;
    const result= await Template.deleteOne({_id:id});
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
  const templates = await Template.find();
  return res.status(200).send(templates);
})
module.exports = router;
