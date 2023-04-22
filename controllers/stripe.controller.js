const express = require("express");
const Stripe = require("stripe");

const Order = require("../models/Order.model");
const asyncHandler = require("../middleware/async");

require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const default_img =
  "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d44fa06fc83f4644b7e8acbc01160e1b_9366/NMD_R1_Primeblue_Shoes_Black_GZ9258_01_standard.jpg";

exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItems.toString()),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [default_img],
          metadata: {
            id: item.product,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE", "VN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/checkout/order-completed`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});

// Create order function
const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);
  console.log(Items);

  // const products = Items.map((item) => {
  //   return {
  //     productId: item.id,
  //     quantity: item.cartQuantity,
  //   };
  // });

  // TRY TO FIX CREATE ORDER INTO DB VIA WEBHOOK

  // const newOrder = new Order({
  //   userId: customer.metadata.userId,
  //   customerId: data.customer,
  //   paymentIntentId: data.payment_intent,
  //   products,
  //   subtotal: data.amount_subtotal,
  //   shipping: data.customer_details,
  //   payment_status: data.payment_status,

  //   username: user.name,
  //   user: user._id,
  //   address: address,
  //   total_price: data.amount_total,
  //   phone: phone,
  // });

  // try {
  //   const savedOrder = await newOrder.save();
  //   console.log("Processed Order:", savedOrder);
  // } catch (err) {
  //   console.log(err);
  // }
};

// Stripe webhoook
exports.webhookHandler = asyncHandler(async (req, res, next) => {
  let data;
  let eventType;

  // Check if webhook signing is configured.
  let webhookSecret = process.env.STRIPE_WEB_HOOK;

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the checkout.session.completed event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer) => {
        try {
          // CREATE ORDER
          createOrder(customer, data);
        } catch (err) {
          console.log(typeof createOrder);
          console.log(err);
        }
      })
      .catch((err) => console.log(err.message));
  }

  res.status(200).end();
});
