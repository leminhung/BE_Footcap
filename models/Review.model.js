const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      min: [1, "Title must be at least 1 character"],
      required: true,
    },
    content: {
      type: String,
      min: [1, "Content must be at least 1 character"],
      required: true,
    },
    rating: { type: Number, required: true },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
