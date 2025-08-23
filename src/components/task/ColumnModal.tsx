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
import { Plus, Pencil } from "lucide-react";
import { Label } from "../ui/label";
import { useBoardStore } from "@/store/board-store";
import { handleCreateColumn, handleUpdateColumn } from "@/apis/tasks";
import { useSnackbar } from "notistack";
import { sortLinkedList } from "@/lib/utils";

type ColumnModalProps = {
  mode: "add" | "edit";
  initialTitle?: string;
  columnId?: string;
};

const ColumnModal: React.FC<ColumnModalProps> = ({
  mode,
  initialTitle = "",
  columnId = "",
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const { enqueueSnackbar } = useSnackbar();
  const { columns } = useBoardStore();

  useEffect(() => {
    if (open && initialTitle) setTitle(initialTitle);
  }, [open, initialTitle]);

  const handleSave = async () => {
    if (!title.trim() || isLoading) return;
    if (mode === "add") {
      const prevId =
        columns.length > 0 ? sortLinkedList(columns).at(-1)?._id ?? null : null;
      const resp = await handleCreateColumn({
        title: title.trim(),
        prevId,
        nextId: null,
      });
      if (resp.isError) {
        enqueueSnackbar("Something went wront, try again", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("New Column created successfully", {
        variant: "info",
      });
    } else {
      handleUpdateColumn(columnId, title);
    }

    setTitle("");
    setOpen(false);
  };

  const isEdit = mode === "edit";
  const TriggerIcon = mode === "add" ? Plus : Pencil;
  const modalLabel = mode === "add" ? "Add New Column" : "";

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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Column" : "Edit Column"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new column for your board."
              : "Update the column title."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-2">
          <Label htmlFor="column-title">Title</Label>
          <Input
            id="column-title"
            placeholder="e.g. To Do"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !!isLoading}>
            {isLoading
              ? "Saving..."
              : mode === "add"
              ? "Add Column"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnModal;
