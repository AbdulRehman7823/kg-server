const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const Token = require("../../model/token");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const Joi = require("joi");

//send email for reset password
router.post("/", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .send({ message: "User with given Email is not Exist" });

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `${process.env.BASE_URL}auth/password-reset?userId=${user._id}&token=${token.token}`;
    await sendEmail(user.email, "Password Reset", url);
    return res.status(200).send({ message: "Email for Reset Password Sent" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    console.log(user)
    if (!user) return res.status(400).send({ message: "Invalid Link" });
    let token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid Link" });

    res.status(200).send({ message: "Valid URL" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//reset password
router.post("/:id/:token", async (req, res) => {
  try {
    console.log(req.body.password);
    const password = req.body.password;
    if (!password)
      return res.status(400).send({ message: "Please Provide a password" });
    if (password.length < 8)
      return res
        .status(400)
        .send({ message: "Invalid password lenght must be 8" });

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid Link" });

    let token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid Link" });

    if (!user.verified) user.verified = true;

    const hashPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();

    user.password = hashPassword;
    await user.save();
    await token.remove();

    console.log(user);
    res.status(200).send({ message: "Password Reset Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
