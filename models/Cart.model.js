const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    total_quantity: {
      type: Number,
      required: true,
      min: [0, "Must be at least 0"],
    },
    total_price: {
      type: Number,
      required: true,
      min: [0, "Must be at least 0"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

CartSchema.virtual("productss", {
  ref: "Product",
  localField: "_id",
  foreignField: "cart",
  justOne: false,
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
