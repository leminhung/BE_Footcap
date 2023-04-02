const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/.env" });

// Load models
const Product = require("./models/Product.model");
// const User = require("./models/User.model");
// const Order = require("./models/Order.model");
const Category = require("./models/Category.model");
const Assets = require("./models/Assets.model");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

// Read JSON files
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, "utf8")
);
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, "utf8")
// );
// const orders = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/orders.json`, "utf8")
// );
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/categories.json`, "utf8")
);
const images = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/images.json`, "utf8")
);

// import into DB
const importData = async () => {
  try {
    await Product.create(products);
    // await User.create(users);
    // await Order.create(orders);
    await Category.create(categories);
    await Assets.create(images);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();
    // await Order.deleteMany();
    await Category.deleteMany();
    await Assets.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
