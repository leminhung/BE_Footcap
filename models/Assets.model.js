const mongoose = require("mongoose");

const AssetsSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      require: true,
    },
  },
  { timestamps: true }
);

const Assets = mongoose.model("Assets", AssetsSchema);

module.exports = Assets;
