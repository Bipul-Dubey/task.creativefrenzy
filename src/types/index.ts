export type TTask = {
  id: string;
  title: string;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
};

export type TColumn = { id: string; title: string; tasks?: TTask[] };
