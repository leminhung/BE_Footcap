const mongoose = require("mongoose");
const slugify = require("slugify");

// Delete FK to order
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be at least 0"],
    },
    code: { type: String, required: true },
    color: { type: [String], required: true },
    status: { type: Number, required: true },
    size: {
      type: [String],
      enum: ["XL", "L", "M", "S", "XXL", "3XL"],
      required: true,
    },
    slug: String,
    description: String,
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: { type: Number, min: [0, "Discount must be at least 0"] },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be at least 0"],
    },
    sold: { type: Number, default: 0 },
    featured: { type: Number, required: true },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

productSchema.pre("remove", async function (next) {
  await this.model("Assets").deleteMany({ product: this._id });
  await this.model("Comment").deleteMany({ product: this._id });
  next();
});

productSchema.virtual("assets", {
  ref: "Assets",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

productSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", productSchema);
