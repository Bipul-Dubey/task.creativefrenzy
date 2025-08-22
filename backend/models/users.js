const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    fullName: String,
    email: { type: String, unique: true, index: true },
    passwordHash: String,
    profileUrl: String,
    isOnline: Boolean,
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
