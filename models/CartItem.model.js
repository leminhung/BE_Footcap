const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
      // required: true,
      min: [0, "Quantity must be at least 0"],
    },
    price: {
      type: Number,
      // required: true,
      min: [0, "Price must be at least 0"],
    },
    // total_quantity: {
    //   type: Number,
    //   required: true,
    //   min: [0, "Must be at least 0"],
    // },
    // total_price: {
    //   type: Number,
    //   required: true,
    //   min: [0, "Must be at least 0"],
    // },
    // products: [
    //   {
    //     productId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Product",
    //       required: true,
    //     },
    //     quantity: {
    //       type: Number,
    //       required: true,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

// CartItemSchema.virtual("productss", {
//   ref: "Product",
//   localField: "_id",
//   foreignField: "cart",
//   justOne: false,
// });

const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = CartItem;
