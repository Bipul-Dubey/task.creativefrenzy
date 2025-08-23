"use client";
import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { TaskColumn } from "./TaskColumn";
import { useBoardStore } from "@/store/board-store";
import { sortLinkedList } from "@/lib/utils";
import {
  handleDeleteColumn,
  handleDeleteTask,
  handleReorderColumn,
} from "@/apis/tasks";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

const TaskArea = () => {
  const { columns, isColumnLoading } = useBoardStore();
  const [activeCol, setActiveCol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const shortedColumns = useMemo(() => {
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

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    console.log(active);
    const findColumn = shortedColumns.find(
      (item) => item._id === active.data?.current?.columnId
    );

    if (findColumn) {
      setActiveCol(findColumn.title);
    }

    const aId = String(active.id);
    const oId = String(over.id);

    if (aId.startsWith("col-") && oId.startsWith("col-")) {
      setIsLoading(true);
      const { columns } = useBoardStore.getState();

      const from = columns.findIndex((c) => `col-${c._id}` === aId);
      const to = columns.findIndex((c) => `col-${c._id}` === oId);

      if (from !== -1 && to !== -1 && from !== to) {
        const newOrder = arrayMove(columns, from, to);
        useBoardStore.setState({ columns: newOrder });

        const movedCol = newOrder[to];
        const prevId = to > 0 ? newOrder[to - 1]._id : null;
        const nextId = to < newOrder.length - 1 ? newOrder[to + 1]._id : null;

        await handleReorderColumn(movedCol._id, { prevId, nextId });
        setActiveCol(null);
        setIsLoading(false);
      }
      return;
    }
  };

  if (isColumnLoading && shortedColumns.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      {shortedColumns.length === 0 && (
        <div className="w-full flex flex-col items-center space-y-2">
          <h3 className="text-2xl font-bold">No Column available</h3>
          <p className="text-gray-500">
            Please add new columns to manage tasks
          </p>
        </div>
      )}
      {isLoading ? <div> Reordering... </div> : null}
      <DndContext
        sensors={sensors}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveCol(null)}
      >
        <SortableContext
          items={shortedColumns.map((c) => `col-${c._id}`)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {shortedColumns.map((col) => (
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
          {activeCol ? (
            <TaskColumn
              column={shortedColumns.find((c) => `col-${c._id}` === activeCol)!}
              onDelete={() => {}}
              onDeleteTask={() => {}}
            />
          ) : null}
        </DragOverlay>{" "}
      </DndContext>
    </div>
  );
};

export default TaskArea;
