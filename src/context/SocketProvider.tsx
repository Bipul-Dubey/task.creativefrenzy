"use client";
import React, { createContext, useContext, useEffect } from "react";
import socket from "@/lib/socket";
import { ServerEvents } from "@/types";
import { useBoardStore } from "@/store/board-store";
import { handleGetColumns, handleGetTask } from "@/apis/tasks";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    updateColumns,
    deleteColumn,
    updateColumn,
    setColumnLoading,
    setColumns,
    setPreTasks,
    deleteTask,
    setTasks,
  } = useBoardStore();
  useEffect(() => {
    socket.on(ServerEvents.CONNECT, () => console.log("Connected:", socket.id));
    socket.on(ServerEvents.DISCONNECT, () => console.log("Disconnected"));

    // event data mapping
    socket.on(ServerEvents.COLUMN_CREATED, (data) => {
      updateColumns(data);
    });

    // delete columns
    socket.on(ServerEvents.COLUMN_DELETED, (data) => {
      deleteColumn(data);
    });

    // update columns
    socket.on(ServerEvents.COLUMN_UPDATED, (data) => {
      updateColumn(data);
    });

    // on reorder of column refetch all data
    socket.on(ServerEvents.COLUMN_REORDERED, (data) => {
      (async () => {
        setColumnLoading(true);
        const columns = await handleGetColumns();
        if (Array.isArray(columns.data)) {
          setColumns(columns.data);
        }
        setColumnLoading(false);
      })();
    });

    // ======= tasks ========
    socket.on(ServerEvents.TASK_CREATED, (data) => {
      setPreTasks(data);
    });

    socket.on(ServerEvents.TASK_UPDATED, (data) => {
      setPreTasks({ task: data, updatedNeighbors: [] });
    });

    socket.on(ServerEvents.TASK_DELETED, (data) => {
      deleteTask(data.id);
    });

    socket.on(ServerEvents.TASK_REORDERED, (data) => {
      (async () => {
        const tasks = await handleGetTask();
        if (Array.isArray(tasks.data)) {
          setTasks(tasks.data);
        }
      })();
    });

    return () => {
      socket.off(ServerEvents.CONNECT);
      socket.off(ServerEvents.DISCONNECT);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
