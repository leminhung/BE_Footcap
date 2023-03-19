const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { codeEnum } = require("../enum/status-code.enum");

exports.stripeCtrl = (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(codeEnum.SERVER_ERROR).json({ message: stripeErr });
      } else {
        res
          .status(codeEnum.SUCCESS)
          .json({ success: true, message: stripeRes });
      }
    }
  );
};
