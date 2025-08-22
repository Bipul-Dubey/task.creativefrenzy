const { Schema, model, Types } = require("mongoose");

const columnSchema = new Schema(
  {
    title: { type: String, required: true },
    prev: {
      type: Types.ObjectId,
      ref: "Column",
      default: null,
    },
    next: {
      type: Types.ObjectId,
      ref: "Column",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = model("Column", columnSchema);
