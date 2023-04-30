const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: String,
    description: {
      type: String,
      default: "Hello",
    },
    // Trạng thái hoạt động (1 - Active, 0 - Inactive)
    status: {
      type: Number,
      default: 1,
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

categorySchema.pre("remove", async function (next) {
  const products = await this.model("Product")
    .find({
      category: this._id.toString(),
    })
    .select("_id");

  const prodIds = products.map((p) => p._id.toString());

  // await this.model("Comment").deleteMany({ product: { $in: prodIds } });
  // await this.model("Product").deleteMany({ category: this._id });
  next();
  l("Image").deleteMany({ product: { $in: prodIds } });
  await this.mod;
});

module.exports = mongoose.model("Category", categorySchema);
