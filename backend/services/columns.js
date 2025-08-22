const express = require("express");
const router = express.Router();
const Column = require("../models/columns");

router.get("/", async (req, res) => {
  try {
    const columns = await Column.find();
    res.json(columns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io");

    const { title, prevId, nextId } = req.body;

    const column = new Column({
      title,
      prev: prevId || null,
      next: nextId || null,
    });
    await column.save();

    if (prevId) await Column.findByIdAndUpdate(prevId, { next: column._id });
    if (nextId) await Column.findByIdAndUpdate(nextId, { prev: column._id });

    io.emit("column:created", column);
    res.json(column);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const io = req.app.get("io");

    const { title } = req.body;
    const updated = await Column.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    io.emit("column:updated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const io = req.app.get("io");

    const { id } = req.params;
    const col = await Column.findById(id);
    if (!col) return res.status(404).json({ error: "Column not found" });

    if (col.prev) await Column.findByIdAndUpdate(col.prev, { next: col.next });
    if (col.next) await Column.findByIdAndUpdate(col.next, { prev: col.prev });

    await col.deleteOne();
    io.emit("column:deleted", { id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/reorder/:id", async (req, res) => {
  try {
    const io = req.app.get("io");

    const { prevId, nextId } = req.body;
    const columnId = req.params.id;

    const column = await Column.findById(columnId);
    if (!column) return res.status(404).json({ error: "Column not found" });

    // disconnect with older previous and next
    if (column.prev)
      await Column.findByIdAndUpdate(column.prev, { next: column.next });
    if (column.next)
      await Column.findByIdAndUpdate(column.next, { prev: column.prev });

    // connect to new previous and next
    if (prevId) await Column.findByIdAndUpdate(prevId, { next: columnId });
    if (nextId) await Column.findByIdAndUpdate(nextId, { prev: columnId });

    // update current column previous and next
    column.prev = prevId || null;
    column.next = nextId || null;
    await column.save();

    // emit the event to notify others
    io.emit("column:reorder", {
      columnId,
      prevId,
      nextId,
    });

    res.json({ success: true, column });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
