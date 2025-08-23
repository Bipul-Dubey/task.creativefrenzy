"use client";
import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import { useBoardStore } from "@/store/board-store";
import { sortLinkedList } from "@/lib/utils";
import {
  handleDeleteColumn,
  handleDeleteTask,
  handleReorderColumn,
  handleReorderTask,
} from "@/apis/tasks";
import type { ITask, IColumn } from "@/types";

const TaskArea = () => {
  const { columns, isColumnLoading } = useBoardStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const sortedColumns = useMemo(() => {
    return sortLinkedList(columns);
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const deleteColumn = (columnId: string) => {
    handleDeleteColumn(columnId);
  };

  const deleteTask = (taskId: string) => {
    handleDeleteTask(taskId);
  };

  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);

    if (id.startsWith("col-")) {
      const colId = id.replace("col-", "");
      const col = sortedColumns.find((c) => c._id === colId) || null;
      setActiveTask(null);
      setActiveColumn(col || null);
      return;
    }

    if (id.startsWith("task-")) {
      const taskId = id.replace("task-", "");
      const currentTask =
        useBoardStore.getState().tasks.find((t: ITask) => t._id === taskId) ||
        null;
      setActiveColumn(null);
      setActiveTask(currentTask || null);
      return;
    }

    setActiveColumn(null);
    setActiveTask(null);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveColumn(null);
    setActiveTask(null);
    if (!over) return;

    const aId = String(active.id);
    const oId = String(over.id);

    // Columns reorder
    if (aId.startsWith("col-") && oId.startsWith("col-")) {
      setIsLoading(true);
      const stateCols = useBoardStore.getState().columns;
      const from = stateCols.findIndex((c) => `col-${c._id}` === aId);
      const to = stateCols.findIndex((c) => `col-${c._id}` === oId);

      if (from !== -1 && to !== -1 && from !== to) {
        const newOrder = arrayMove(stateCols, from, to);
        useBoardStore.setState({ columns: newOrder });

        const movedCol = newOrder[to];
        const prevId = to > 0 ? newOrder[to - 1]._id : null;
        const nextId = to < newOrder.length - 1 ? newOrder[to + 1]._id : null;

        try {
          await handleReorderColumn(movedCol._id, { prevId, nextId });
        } finally {
          setIsLoading(false);
        }
      }
      return;
    }

    // Tasks reorder/move
    if (aId.startsWith("task-")) {
      const activeData = active.data.current as
        | { type: "task"; taskId: string; columnId: string; index: number }
        | undefined;
      const overData = over.data.current as
        | { type: "task"; taskId: string; columnId: string; index: number }
        | { type: "column"; columnId: string }
        | undefined;

      const { tasks } = useBoardStore.getState();
      const taskId = aId.replace("task-", "");
      const draggedTask = tasks.find((t) => t._id === taskId);
      if (!draggedTask) return;

      const toColumnId = oId.startsWith("task-")
        ? (overData as any)?.columnId
        : oId.startsWith("col-")
        ? oId.replace("col-", "")
        : null;

      if (!toColumnId) return;

      const tasksByColumn = useBoardStore.getState().tasksByColumn;
      const destList = sortLinkedList(tasksByColumn[toColumnId] || []);

      let insertAt: number;
      if (oId.startsWith("task-")) {
        insertAt = (overData as any)?.index ?? 0;
      } else {
        insertAt = destList.length;
      }

      const simulatedDest = [...destList];
      // If moving within same column, remove its old position first
      if (draggedTask.columnId === toColumnId) {
        const oldIdx = simulatedDest.findIndex((t) => t._id === taskId);
        if (oldIdx > -1) simulatedDest.splice(oldIdx, 1);
      }
      const clamped = Math.max(0, Math.min(insertAt, simulatedDest.length));
      simulatedDest.splice(clamped, 0, {
        ...draggedTask,
        columnId: toColumnId,
      });

      const prevId = clamped > 0 ? simulatedDest[clamped - 1]._id : null;
      const nextId =
        clamped < simulatedDest.length - 1
          ? simulatedDest[clamped + 1]._id
          : null;

      await handleReorderTask(taskId, {
        prevId,
        nextId,
        columnId: toColumnId,
      });
    }
  };

  if (isColumnLoading && sortedColumns.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      {sortedColumns.length === 0 && (
        <div className="w-full flex flex-col items-center space-y-2">
          <h3 className="text-2xl font-bold">No Column available</h3>
          <p className="text-gray-500">
            Please add new columns to manage tasks
          </p>
        </div>
      )}
      {isLoading ? <div>Reordering...</div> : null}

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setActiveColumn(null);
          setActiveTask(null);
        }}
      >
        <SortableContext
          items={sortedColumns.map((c) => `col-${c._id}`)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {sortedColumns.map((col) => (
              <TaskColumn
                key={col._id}
                column={col}
                onDelete={() => deleteColumn(col._id)}
                onDeleteTask={(taskId) => deleteTask(taskId)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeColumn ? (
            <TaskColumn
              column={activeColumn}
              onDelete={() => {}}
              onDeleteTask={() => {}}
            />
          ) : activeTask ? (
            <TaskCard
              task={activeTask}
              columnId={activeTask.columnId}
              index={0}
              onDelete={() => {}}
              dragPreview
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TaskArea;
