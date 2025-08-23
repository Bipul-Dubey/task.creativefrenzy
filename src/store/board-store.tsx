import { IColumn, ITask, IUser } from "@/types";
import { create } from "zustand";

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

type BoardState = {
  isColumnLoading: boolean;
  setColumnLoading: (value: boolean) => void;
  columns: IColumn[];
  updateColumns: (data: {
    column: IColumn;
    updatedNeighbors: IColumn[];
  }) => void;
  updateColumn: (column: IColumn) => void;
  deleteColumn: (data: { id: string; updatedNeighbors: IColumn[] }) => void;
  setColumns: (columns: IColumn[]) => void;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser) => void;

  // tasks
  tasks: ITask[];
  tasksByColumn: Record<string, ITask[]>;
  setTasks: (tasks: ITask[]) => void;
  setPreTasks: (data: { task: ITask; updatedNeighbors: ITask[] }) => void;
  deleteTask: (taskId: string) => void;
};

const handleGroupBy = (tasks: ITask[]) => {
  const grouped: Record<string, ITask[]> = {};
  for (const task of tasks) {
    if (!grouped[task.columnId]) {
      grouped[task.columnId] = [];
    }
    grouped[task.columnId].push(task);
  }

  return grouped;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  currentUser: null,
  columns: [],
  isColumnLoading: false,
  tasks: [],
  tasksByColumn: {},

  setColumnLoading: (val) => {
    set((state) => ({
      ...state,
      isColumnLoading: val,
    }));
  },
  setCurrentUser: (user) => {
    set((state) => ({
      ...state,
      currentUser: user,
    }));
  },
  setColumns: (columns: IColumn[]) => {
    set((state) => ({
      ...state,
      columns: columns,
    }));
  },
  updateColumns: ({ column, updatedNeighbors }) => {
    set((state) => {
      const filtered = state.columns.filter(
        (c) =>
          c._id !== column._id && !updatedNeighbors.some((n) => n._id === c._id)
      );

      return {
        columns: [...filtered, column, ...updatedNeighbors],
      };
    });
  },
  deleteColumn: (data) => {
    const { id, updatedNeighbors } = data;
    set((state) => {
      let updated = state.columns.filter((c) => c._id !== id);

      updatedNeighbors.forEach((neighbor) => {
        const idx = updated.findIndex((c) => c._id === neighbor._id);
        if (idx !== -1) {
          updated[idx] = neighbor;
        } else {
          updated.push(neighbor);
        }
      });

      return { columns: updated };
    });
  },
  updateColumn: (column) => {
    set((state) => {
      const filtered = state.columns.filter((c) => c._id !== column._id);

      return {
        columns: [...filtered, column],
      };
    });
  },
  setTasks: (tasks) =>
    set(() => {
      const grouped = handleGroupBy(tasks);
      return { tasks, tasksByColumn: grouped };
    }),

  setPreTasks: ({ task, updatedNeighbors }) => {
    set((state) => {
      let newTaskList = [...state.tasks];

      const upsert = (t: ITask) => {
        const index = newTaskList.findIndex((x) => x._id === t._id);
        if (index >= 0) {
          newTaskList[index] = t;
        } else {
          newTaskList.push(t);
        }
      };

      upsert(task);
      updatedNeighbors.forEach(upsert);

      const grouped: Record<string, ITask[]> = {};
      for (const t of newTaskList) {
        if (!grouped[t.columnId]) grouped[t.columnId] = [];
        grouped[t.columnId].push(t);
      }

      return {
        taskList: newTaskList,
        tasksByColumn: grouped,
      };
    });
  },
  deleteTask: (taskId) =>
    set(() => {
      const filteredTask = get().tasks.filter((item) => item._id !== taskId);
      const grouped = handleGroupBy(filteredTask);
      return { tasks: filteredTask, tasksByColumn: grouped };
    }),
}));
