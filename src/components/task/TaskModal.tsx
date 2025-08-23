"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil } from "lucide-react";
import { Label } from "../ui/label";
import { ITask, ITaskPayload } from "@/types";
import { handleCreateTask, handleUpdateTask } from "@/apis/tasks";
import { useSnackbar } from "notistack";
import { sortLinkedList } from "@/lib/utils";
import { useBoardStore } from "@/store/board-store";

type TaskModalProps = {
  mode: "add" | "edit";
  initial?: ITask | null;
  variant?: "icon" | null;
  columnId: string;
};

const TaskModal: React.FC<TaskModalProps> = ({
  mode,
  initial,
  variant,
  columnId,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ITaskPayload>({
    columnId,
    title: "",
    description: "",
    nextId: null,
    prevId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { tasksByColumn } = useBoardStore();

  const tasks: ITask[] = useMemo(() => {
    if (Object.keys(tasksByColumn).length > 0) {
      if (Array.isArray(tasksByColumn[columnId])) {
        return sortLinkedList(tasksByColumn[columnId]);
      }
      return [];
    }
    return [];
  }, [tasksByColumn, columnId]);

  useEffect(() => {
    if (open && initial) {
      setFormData({ ...initial, prevId: initial.prev, nextId: initial.next });
    }
  }, [open, initial]);

  const handleSave = async () => {
    if (!formData?.title.trim() || !formData.description || isLoading) {
      enqueueSnackbar("Fill all fields", { variant: "warning" });

      return;
    }
    // create/update task
    if (mode === "add") {
      setIsLoading(true);
      const resp = await handleCreateTask({
        ...formData,
        columnId,
        nextId: tasks.length > 0 ? tasks.at(0)?._id ?? null : null,
      });
      if (!resp.isError) {
        enqueueSnackbar("Task created", { variant: "info" });
      }
      setIsLoading(false);
    } else {
      if (initial?._id) {
        handleUpdateTask(initial?._id, formData);
      }
    }
    setFormData({
      columnId,
      title: "",
      description: "",
      nextId: null,
      prevId: null,
    });
    setOpen(false);
  };

  const isEdit = mode === "edit" || variant === "icon";
  const TriggerIcon = mode === "add" ? Plus : Pencil;
  const modalLabel =
    variant === "icon" ? "" : mode === "add" ? "Add New Task" : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEdit ? "ghost" : "default"}
          size={isEdit ? "icon" : "default"}
        >
          <TriggerIcon className="h-4 w-4" />
          {modalLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new task in this column."
              : "Update the task details."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Task title"
              value={formData.title}
              autoFocus
              onChange={(e) => {
                setFormData({
                  ...formData,
                  title: e.target.value,
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Description"
              value={formData.description}
              rows={4}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title.trim() || !!isLoading}
          >
            {isLoading
              ? "Saving..."
              : mode === "add"
              ? "Add Task"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
