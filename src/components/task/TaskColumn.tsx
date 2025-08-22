"use client";
import { TColumn } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { TaskList } from "./TaskList";
import ColumnModal from "./ColumnModal";
import TaskModal from "./TaskModal";

export const TaskColumn = ({
  column,
  onRename,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  column: TColumn;
  onRename: (title: string) => void;
  onDelete: () => void;
  onAddTask: (title: string) => void;
  onEditTask: (taskId: string, title: string) => void;
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
    id: `col-${column.id}`,
    data: { type: "column", columnId: column.id },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

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
          <TaskModal mode="add" variant={"icon"} />
          <ColumnModal mode="edit" initialTitle={column.title} />

          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {column?.tasks && column.tasks.length > 0 && (
        <div className="flex flex-col gap-2">
          {column?.tasks?.map((t, index) => (
            <TaskList
              key={t.id}
              task={t}
              columnId={column.id}
              index={index}
              onEditTitle={(title) => onEditTask(t.id, title)}
              onDelete={() => onDeleteTask(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
