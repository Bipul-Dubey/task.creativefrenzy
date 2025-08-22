"use client";
import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { TColumn } from "@/types";
import { TaskColumn } from "./TaskColumn";
import { useBoardStore } from "@/store/board-store";

const uid = () => crypto.randomUUID();

const TaskArea = () => {
  const { columns } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const columnItems = useMemo(
    () => columns.map((c) => `col-${c.id}`),
    [columns]
  );

  const renameColumn = (columnId: string, title: string) => {
    // rename columns
  };

  const deleteColumn = (columnId: string) => {
    // delete columns
  };

  const addTask = (columnId: string, title: string) => {
    // add task
  };

  const editTask = (columnId: string, taskId: string, title: string) => {
    // edit task
  };

  const deleteTask = (columnId: string, taskId: string) => {
    // delete task
  };

  const findColumnByTaskId = (taskId: string) => {
    for (const c of columns) {
      if (c.tasks?.find((t) => t.id === taskId)) return c.id;
    }
    return null;
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const aId = String(active.id);
    const oId = String(over.id);

    // Column reorder
    if (aId.startsWith("col-") && oId.startsWith("col-")) {
      const from = columnItems.indexOf(aId);
      const to = columnItems.indexOf(oId);
      if (from !== -1 && to !== -1 && from !== to) {
        // const updated = arrayMove(prev, from, to)
      }
      return;
    }

    // Task moves (within/between columns)
    if (aId.startsWith("task-")) {
      const activeData = active.data.current as any;
      const overData = over.data.current as any;

      // Identify from (columnId, index)
      let fromColId: string | null = null;
      let fromIndex: number | null = null;
      if (activeData?.columnId != null) {
        fromColId = activeData.columnId;
        fromIndex = activeData.index;
      } else {
        // fallback: search
        const taskId = aId.replace("task-", "");
        fromColId = findColumnByTaskId(taskId);
        const col = columns.find((c) => c.id === fromColId);
        fromIndex =
          col?.tasks?.findIndex((t) => `task-${t.id}` === aId) ?? null;
      }

      // Identify destination (column + index)
      let toColId: string | null = null;
      let toIndex: number | null = null;

      if (oId.startsWith("task-")) {
        // dropped over another task
        toColId =
          overData?.columnId ?? findColumnByTaskId(oId.replace("task-", ""));
        toIndex = overData?.index ?? 0;
      } else if (oId.startsWith("col-")) {
        // dropped over the column container -> append to end
        toColId = oId.replace("col-", "");
        const col = columns.find((c) => c.id === toColId);
        toIndex = col ? col.tasks?.length ?? null : 0;
      }

      if (!fromColId || fromIndex == null || !toColId || toIndex == null)
        return;

      if (fromColId === toColId && fromIndex === toIndex) return;

      function setColumns(prev: TColumn[]) {
        const next = prev.map((c) => ({ ...c, tasks: [...(c.tasks ?? [])] }));
        const fromCol = next.find((c) => c.id === fromColId)!;
        const toCol = next.find((c) => c.id === toColId)!;

        const [moved] = fromCol.tasks.splice(fromIndex!, 1);
        const insertAt = Math.max(0, Math.min(toIndex!, toCol.tasks.length));
        toCol.tasks.splice(insertAt, 0, moved);
        return next;
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {columns.length === 0 && (
        <div className="w-full flex flex-col items-center space-y-2">
          <h3 className="text-2xl font-bold">No Column available</h3>
          <p className="text-gray-500">
            Please add new columns to manage tasks
          </p>
        </div>
      )}
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <div key={col.id}>
              <TaskColumn
                column={col}
                onRename={(t) => renameColumn(col.id, t)}
                onDelete={() => deleteColumn(col.id)}
                onAddTask={(t) => addTask(col.id, t)}
                onEditTask={(taskId, title) => editTask(col.id, taskId, title)}
                onDeleteTask={(taskId) => deleteTask(col.id, taskId)}
              />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default TaskArea;
