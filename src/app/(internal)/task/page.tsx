import SubTaskHeader from "@/components/task/SubTaskHeader";
import TaskArea from "@/components/task/TaskArea";
import TaskHeader from "@/components/task/TaskHeader";
import React from "react";

const TaskPage = () => {
  return (
    <div
      className="flex flex-col space-y-2 px-4"
      style={{
        height: "calc(100vh - 70px)",
      }}
    >
      <TaskHeader />
      <SubTaskHeader />
      <TaskArea />
    </div>
  );
};

export default TaskPage;
