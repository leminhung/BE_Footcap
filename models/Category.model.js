const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: String,
    description: {
      type: String,
      required: [true, "Bạn chưa nhập mô tả"],
    },
    // Trạng thái hoạt động (1 - Active, 0 - Inactive)
    status: {
      type: Number,
      required: [true, "Bạn chưa nhập trạng thái hoạt động"],
    },
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
  await this.modeel("Product").deleteMany({ category: this._id });
  next();
  l("Image").deleteMany({ product: { $in: prodIds } });
  await this.mod;
});

module.exports = mongoose.model("Category", categorySchema);
