"use client";
import React, { useState, useEffect } from "react";
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
import { TTask } from "@/types";

type TaskModalProps = {
  mode: "add" | "edit";
  initial?: TTask | null;
  variant?: "icon" | null;
};

const TaskModal: React.FC<TaskModalProps> = ({ mode, initial, variant }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TTask>(
    initial ?? {
      id: "",
      title: "",
      description: "",
    }
  );
  const [isLoading] = useState(false);

  useEffect(() => {
    if (open && initial) {
      setFormData(initial);
    }
  }, [open, initial]);

  const handleSave = () => {
    if (!formData?.title.trim() || isLoading) return;
    // create/update task
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
              placeholder="Optional description"
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
