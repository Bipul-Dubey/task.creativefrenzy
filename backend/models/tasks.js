const { Schema, model, Types } = require("mongoose");

const TaskSchema = new Schema(
  {
    columnId: {
      type: Types.ObjectId,
      ref: "Column",
      index: true,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    prev: { type: Types.ObjectId, ref: "Task", default: null },
    next: { type: Types.ObjectId, ref: "Task", default: null },
  },
  { timestamps: true }
);

module.exports = model("Task", TaskSchema);
