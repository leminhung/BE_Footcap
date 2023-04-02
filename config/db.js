const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(
      process.env.MONGO_URI,
      (err, db) => {
        if (err) throw err;
        console.log(`MongoDb connected`.cyan.bold);
        db.collection("products").createIndex({
          title: "text",
        });
      },
      {
        useNewUrlParser: true,
      }
    );
  } catch (error) {
    console.log("[err--]", error);
  }
};

module.exports = connectDB;
