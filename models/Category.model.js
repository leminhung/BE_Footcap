const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: String,
    // description: {
    //   type: String,
    //   required: [true, "Bạn chưa nhập mô tả"],
    // },
    thumbnail: {
      type: String,
      default: "thumbnail.jpg",
    },
  },
  { toJSON: { virtuals: true } }
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

  await this.model("Comment").deleteMany({ product: { $in: prodIds } });
  await this.model("Image").deleteMany({ product: { $in: prodIds } });
  await this.model("Product").deleteMany({ category: this._id });
  next();
});

module.exports = mongoose.model("Category", categorySchema);
