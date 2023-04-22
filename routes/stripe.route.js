const express = require("express");
const router = express.Router();

const {
  createCheckoutSession,
  webhookHandler,
} = require("../controllers/stripe.controller");

router.post("/stripe/create-checkout-session", createCheckoutSession);
router.post(
  "/stripe/webhook",
  express.json({ type: "application/json" }),
  webhookHandler
);

module.exports = router;
