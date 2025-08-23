"use client";
import { handleGetColumns, handleGetTask } from "@/apis/tasks";
import { useBoardStore } from "@/store/board-store";
import React, { useEffect } from "react";

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { setColumns, setColumnLoading, setTasks } = useBoardStore();
  useEffect(() => {
    (async () => {
      setColumnLoading(true);
      const columns = await handleGetColumns();
      if (Array.isArray(columns.data)) {
        setColumns(columns.data);
      }
      setColumnLoading(false);
    })();

    (async () => {
      const tasks = await handleGetTask();
      if (Array.isArray(tasks.data)) {
        setTasks(tasks.data);
      }
    })();
  }, []);
  return <div>{children}</div>;
};

export default DataProvider;
