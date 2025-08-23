export enum ServerEvents {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  COLUMN_CREATED = "column:created",
  COLUMN_UPDATED = "column:updated",
  COLUMN_DELETED = "column:deleted",
  TASK_CREATED = "task:created",
  TASK_UPDATED = "task:updated",
  TASK_DELETED = "task:deleted",
  TASK_MOVED = "task:reordered",
  COLUMN_REORDERED = "column:reordered",
}

export interface IUserLoginPayload {
  email: string;
  password: string;
}

export interface IUserRegisterPayload extends IUserLoginPayload {
  fullName: string;
}

export interface IUser {
  email: string;
  fullName: string;
  id: string;
  isOnline: boolean;
  profileUrl: string;
}

export interface IApiResponse<T> {
  data?: T;
  isError: boolean;
  error?: unknown;
}

export interface IColumnPayload {
  title: string;
  nextId: string | null;
  prevId: string | null;
}

export interface IColumn {
  _id: string;
  title: string;
  next: string | null;
  prev: string | null;
}

export interface ITaskPayload {
  columnId: string;
  title: string;
  description: string;
  prevId: string | null;
  nextId: string | null;
}

export interface ITask {
  _id: string;
  columnId: string;
  title: string;
  description: string;
  prev: string | null;
  next: string | null;
  createdAt: string;
  updatedAt?: string;
}
