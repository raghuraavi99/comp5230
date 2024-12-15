const mongoose = require("mongoose");
const envUtil = require("../util/envUtil");

const connectDB = async () => {
  try {
    console.log("Connecting to mongodb ..... ", envUtil.getMongoDbUri());
    await mongoose.connect(envUtil.getMongoDbUri());
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    //process.exit(1);
  }
};

module.exports = connectDB;
