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

    const updateOps = [];

    if (prevId) {
      updateOps.push(
        Column.findByIdAndUpdate(prevId, { next: column._id }, { new: true })
      );
    }
    if (nextId) {
      updateOps.push(
        Column.findByIdAndUpdate(nextId, { prev: column._id }, { new: true })
      );
    }

    const updatedNeighbors = await Promise.all(updateOps);
    const updatedColumn = await Column.findById(column._id);

    const payload = {
      column: updatedColumn,
      updatedNeighbors: updatedNeighbors.filter(Boolean),
    };

    io.emit("column:created", payload);
    res.json(payload);
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

    let updatedNeighbors = [];

    if (col.prev) {
      const updatedPrev = await Column.findByIdAndUpdate(
        col.prev,
        { next: col.next },
        { new: true }
      );
      if (updatedPrev) updatedNeighbors.push(updatedPrev);
    }

    if (col.next) {
      const updatedNext = await Column.findByIdAndUpdate(
        col.next,
        { prev: col.prev },
        { new: true }
      );
      if (updatedNext) updatedNeighbors.push(updatedNext);
    }

    await col.deleteOne();

    io.emit("column:deleted", {
      id,
      updatedNeighbors,
    });

    res.json({ success: true, id, updatedNeighbors });
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

    // 1. Disconnect from old neighbors
    if (column.prev) {
      await Column.findByIdAndUpdate(column.prev, { next: column.next });
    }
    if (column.next) {
      await Column.findByIdAndUpdate(column.next, { prev: column.prev });
    }

    // 2. Connect to new neighbors
    if (prevId) {
      await Column.findByIdAndUpdate(prevId, { next: columnId });
    }
    if (nextId) {
      await Column.findByIdAndUpdate(nextId, { prev: columnId });
    }

    // 3. Update the current column itself
    column.prev = prevId || null;
    column.next = nextId || null;
    await column.save();

    // 4. Fetch updated neighbors for frontend
    const updatedNeighbors = await Column.find({
      _id: { $in: [prevId, nextId].filter(Boolean) },
    });

    const updatedColumn = await Column.findById(columnId);

    // 5. Emit event after all updates are guaranteed done
    io.emit("column:reordered", {
      column: updatedColumn,
      updatedNeighbors,
    });

    res.json({
      success: true,
      column: updatedColumn,
      updatedNeighbors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
