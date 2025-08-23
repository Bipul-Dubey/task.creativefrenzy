"use client";
import { IColumn, ITask } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { TaskCard } from "./TaskCard";
import ColumnModal from "./ColumnModal";
import TaskModal from "./TaskModal";
import { useBoardStore } from "@/store/board-store";
import { useMemo } from "react";
import { sortLinkedList } from "@/lib/utils";

export const TaskColumn = ({
  column,
  onDelete,
  onDeleteTask,
}: {
  column: IColumn;
  onDelete: () => void;
  onDeleteTask: (taskId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `col-${column._id}`,
    data: { type: "column", columnId: column._id },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const { tasksByColumn } = useBoardStore();

  const tasks: ITask[] = useMemo(() => {
    if (Object.keys(tasksByColumn).length > 0) {
      if (Array.isArray(tasksByColumn[column._id])) {
        return sortLinkedList(tasksByColumn[column._id]);
      }
      return [];
    }
    return [];
  }, [tasksByColumn]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-80 shrink-0 rounded-md border bg-background p-2 ${
        isDragging ? "opacity-70" : ""
      }`}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            {...attributes}
            {...listeners}
            className="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-accent"
            title="Drag column"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h4 className="text-lg font-bold">{column.title}</h4>
        </div>
        <div className="flex items-center gap-1">
          <TaskModal mode="add" variant={"icon"} columnId={column._id} />
          <ColumnModal
            mode="edit"
            initialTitle={column.title}
            columnId={column._id}
          />

          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {tasks && tasks.length > 0 && (
        <div className="flex flex-col gap-2">
          {tasks?.map((t, index) => (
            <TaskCard
              key={t._id}
              task={t}
              columnId={column._id}
              index={index}
              onDelete={() => onDeleteTask(t._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
