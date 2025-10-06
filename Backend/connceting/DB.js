const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {

    await mongoose.connect(process.env.MONGODB_URL, );
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
