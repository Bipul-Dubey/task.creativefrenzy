const express = require("express");
const router = express.Router();
const Task = require("../models/tasks.js");

router.get("/", async (req, res) => {
  try {
    // const columnId = req.params.columnId;
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io");

    const { columnId, title, description, prevId, nextId } = req.body;

    const task = new Task({
      columnId,
      title,
      description,
      prev: prevId || null,
      next: nextId || null,
    });

    await task.save();

    if (prevId) {
      await Task.findByIdAndUpdate(prevId, { next: task._id });
    }
    if (nextId) {
      await Task.findByIdAndUpdate(nextId, { prev: task._id });
    }

    const updatedNeighbors = await Task.find({
      _id: { $in: [prevId, nextId].filter(Boolean) },
    });

    const updatedTask = await Task.findById(task._id);

    io.emit("task:created", {
      task: updatedTask,
      updatedNeighbors,
    });

    res.json({
      success: true,
      task: updatedTask,
      updatedNeighbors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const io = req.app.get("io");

    const { title, description } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    io.emit("task:updated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const io = req.app.get("io");
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.prev) await Task.findByIdAndUpdate(task.prev, { next: task.next });
    if (task.next) await Task.findByIdAndUpdate(task.next, { prev: task.prev });

    await task.deleteOne();

    io.emit("task:deleted", { id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/reorder/:id", async (req, res) => {
  try {
    const io = req.app.get("io");

    const { prevId, nextId, columnId } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // disconnect with old previous and next
    if (task.prev) await Task.findByIdAndUpdate(task.prev, { next: task.next });
    if (task.next) await Task.findByIdAndUpdate(task.next, { prev: task.prev });

    // connect to new previous and next
    if (prevId) await Task.findByIdAndUpdate(prevId, { next: taskId });
    if (nextId) await Task.findByIdAndUpdate(nextId, { prev: taskId });

    // update the task itselft
    task.prev = prevId || null;
    task.next = nextId || null;
    // also update the column so if user drag and drop in another then it must update
    if (columnId) task.columnId = columnId;
    await task.save();

    // send the notification
    io.emit("task:reorder", {
      taskId,
      prevId,
      nextId,
      columnId,
    });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
