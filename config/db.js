const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(
      process.env.MONGO_URI,
      (err, db) => {
        if (err) throw err;
        db.collection("products").createIndex({
          title: "text",
        });
      },
      {
        useNewUrlParser: true,
      }
    );
    console.log(`MongoDb connected`.cyan.bold);
  } catch (error) {
    console.log("[err--]", error);
  }
};

module.exports = connectDB;
