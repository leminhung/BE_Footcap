const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDb connected: ${connect.connection.host}`.cyan.bold);
  } catch (error) {
    console.log("[err--]", err);
  }
};

module.exports = connectDB;
