const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const { stripeCtrl } = require("../controllers/stripe.controller");

//router.get('/allusers', allUsers);
router.post("/payment", protect, stripeCtrl);

module.exports = router;
