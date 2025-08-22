import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import ColumnModal from "./ColumnModal";
import TaskModal from "./TaskModal";

const TaskHeader = () => {
  return (
    <div className="py-2 flex items-center justify-between flex-wrap">
      <h3 className="text-lg font-bold">Task Manager</h3>
      <div className="flex gap-3 flex-wrap">
        <ColumnModal mode="add" />
        <TaskModal mode="add" />
      </div>
    </div>
  );
};

export default TaskHeader;
