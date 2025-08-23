"use client";
import { ITask } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";
import { GripVertical, MoreVertical, Trash2 } from "lucide-react";
import TaskModal from "./TaskModal";

export const TaskCard = ({
  task,
  columnId,
  index,
  onDelete,
  dragPreview = false,
}: {
  task: ITask;
  columnId: string;
  index: number;
  onDelete: () => void;
  dragPreview?: boolean;
}) => {
  if (dragPreview) {
    return (
      <div className="rounded-md border bg-card p-3 shadow-sm">
        <div className="text-sm font-medium">{task.title}</div>
      </div>
    );
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task._id}`,
    data: { type: "task", taskId: task._id, columnId, index },
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
            aria-label="Drag task"
            title="Drag"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div>
            <div className="text-base font-semibold">{task.title}</div>
            <p className="text-sm">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TaskModal mode="edit" initial={task} columnId={columnId} />
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
