const mongoose = require("mongoose");
let cached = global.__mongoConn;

async function connectDatabase(uri) {
  if (!uri) throw new Error("MONGODB_URI is required");
  if (cached) return cached;

  cached = await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
  });
  global.__mongoConn = cached;

  return cached;
}

module.exports = { connectDatabase };
