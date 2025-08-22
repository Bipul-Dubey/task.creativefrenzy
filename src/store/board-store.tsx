import { TColumn, TTask } from "@/types";
import { create } from "zustand";
import { v4 as uuid } from "uuid";

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

type BoardState = {
  columns: TColumn[];
  addColumn: (column: Omit<TColumn, "id">) => void;
};

const nowISO = () => new Date().toISOString();

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [],

  addColumn: (column: Omit<TColumn, "id">) => {
    set((s) => ({
      columns: [
        ...s.columns,
        {
          id: uuid(),
          ...column,
        },
      ],
    }));
  },
}));
