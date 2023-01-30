const express = require("express");
const router = express.Router();
const stripe = require("stripe");
const Order = require("../../model/Orders");
const User = require("../../model/User");
const loadStripe = stripe(process.env.STRIPE_SECRET_KEY);


router.route("/payment").post(async (req, res) => {
  const paymentDetails = req.body;

  const session = await loadStripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: paymentDetails.name,
          },
          unit_amount: paymentDetails.price * 100,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: { metadata: req.body },
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}paymentsuccess`,
    cancel_url: `${process.env.CLIENT_URL}paymentcancel`,
  });
  res.status(200).send(session);
});
router.route("/withdraw/:accountId").post(async (req, res) => {
  let payout;
  try {
    payout = await loadStripe.transfers.create({
      amount: req.body.price * 100,
      currency: "usd",
      destination: req.params.accountId,
    });
    const user = await User.findById(req.body.userId);
    if (!user) throw new Error("User not found");
    user.withdrawEarning = 0;
    await user.save();
  } catch (error) {
    res.status(422).send(error);
  }
  res.status(200).send(payout);
});

router.route("/managePayout/:userId").post(async (req, res) => {
  const account = await loadStripe.accounts.create({
    type: "express",
    business_type: "individual",
  });
  const accountLink = await loadStripe.accountLinks.create({
    account: account.id,
    refresh_url:
      "https://kg-server-production.up.railway.app/api/stripe/managePayout",
    return_url: `${process.env.CLIENT_URL}`,
    type: "account_onboarding",
  });
  if (account) {
    const user = await User.findByIdAndUpdate(req.body.userId, {
      accountId: account.id,
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
  }
  res.status(200).send({ accountLink, accountId: account.id });
});

router.route("/webhook").post(async (request, response) => {
  const sig = request.headers["stripe-signature"];
  const payLoad = request.body;

  let event;
  try {
    event = await stripe.webhooks.constructEvent(
      payLoad,
      sig,
      process.env.STRIPE_ENDPOINT_KEY
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);

    console.log("webhook failed");
    return;
  }
  // Handle the event
  switch (event.type) {
    case "payment_intent.canceled":
      console.log("paymnet failed");

      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    case "payment_intent.succeeded":
      console.log(event.data.object.metadata);
      const data = event.data.object.metadata;
      try {
        const user = await User.findById(data.receiverId);
        user.withdrawEarning += data.price;
        await user.save();
        await Order.create(data);
      } catch (error) {
        console.log(error);
      }
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case "account.external_account.created":
      console.log("account created successfully");
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return response.status(200).send("success");
  // Return a 200 response to acknowledge receipt of the event
});
module.exports = router;
