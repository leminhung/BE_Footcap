const Stripe = require("stripe");
const _ = require("lodash");

const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const asyncHandler = require("../middleware/async");
const { roundNumber } = require("../utils/roundNumber");
const OrderDetail = require("../models/OrderDetail.model");

require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const default_img =
  "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d44fa06fc83f4644b7e8acbc01160e1b_9366/NMD_R1_Primeblue_Shoes_Black_GZ9258_01_standard.jpg";

let cartItems;

// ------handmade discount------ :vv
// stripe.coupons.create(
//   {
//     amount_off: 15 * 100,
//     duration: "once",
//     id: "ABCABC",
//     currency: "usd",
//   },
//   function (err, coupon) {
//     console.log({ err, coupon });
//   }
// );

exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  cartItems = req.body.cartItems.map((item) => {
    return {
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.image,
      size: item.size,
      color: item.color,
    };
  });

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
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
        unit_amount: roundNumber(item.price * 100),
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
              value: 8,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 2000,
            currency: "usd",
          },
          display_name: "Express Delivery",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 2,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    discounts: req.body.coupon.code
      ? [
          {
            coupon: req.body.coupon.code,
          },
        ]
      : undefined,
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
  const newOrder = new Order({
    username: data.customer_details.name,
    phone: data.customer_details.phone,
    user: customer.metadata.userId,
    address:
      data.customer_details.address.city +
      " - " +
      data.customer_details.address.country,
    total_price: roundNumber(data.amount_total/100),
    status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    await createOrderDetails(customer, data, savedOrder._id);
  } catch (err) {
    console.log(err);
  }
};

const updateQuantityPurchased = async (productId, purchared) => {
  return await Product.findByIdAndUpdate(productId, {
    $set: { quantity_purchased: purchared },
  });
};

// Update product quantity
const updateProducts = async () => {
  const groupedProducts = _.groupBy(cartItems, "product");

  const quantitiesById = _.mapValues(groupedProducts, (group) => {
    return _.sumBy(group, "quantity");
  });

  const uniqueProducts = _.uniqBy(cartItems, "product");

  return await Promise.all(
    uniqueProducts.map((p) =>
      updateQuantityPurchased(p.product, quantitiesById[p.product])
    )
  );
};

// Create order function
const createOrderDetails = async (customer, data, orderId) => {
  const newOrderDetails = new OrderDetail({
    products: cartItems,
    shippingAddress: {
      fullName: data.customer_details.name,
      address:
        data.customer_details.address.city +
        " - " +
        data.customer_details.address.country,
      cellPhone: data.customer_details.phone,
    },
    order: orderId,
  });

  try {
    const savedOrderDetails = await newOrderDetails.save();
    await updateProducts();
    console.log("Processed savedOrderDetails:", savedOrderDetails);
  } catch (err) {
    console.log(err);
  }
};

// Stripe webhoook
exports.webhookHandler = asyncHandler(async (req, res, next) => {
  let data;
  let eventType;

  let webhookSecret;

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
