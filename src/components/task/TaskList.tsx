"use client";
import { TTask } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import TaskModal from "./TaskModal";

export const TaskList = ({
  task,
  columnId,
  index,
  onEditTitle,
  onDelete,
}: {
  task: TTask;
  columnId: string;
  index: number;
  onEditTitle: (title: string) => void;
  onDelete: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
    data: { type: "task", columnId, index, taskId: task.id },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border bg-card p-3 shadow-sm ${
        isDragging ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            {...attributes}
            {...listeners}
            className="rounded p-1 text-muted-foreground hover:bg-accent"
            title="Drag task"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium">{task.title}</div>
        </div>
        <div className="flex items-center gap-1">
          <TaskModal mode="edit" initial={task} />
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
