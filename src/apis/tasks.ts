import {
  IApiResponse,
  IColumn,
  IColumnPayload,
  ITask,
  ITaskPayload,
} from "@/types";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const handleCreateColumn = async (
  payload: IColumnPayload
): Promise<
  IApiResponse<{
    column: IColumn;
    updatedNeighbors: IColumn[];
  }>
> => {
  try {
    const resp = await axios.post(`${BASE_URL}/columns`, payload);
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const handleGetColumns = async (): Promise<IApiResponse<IColumn[]>> => {
  try {
    const resp = await axios.get(`${BASE_URL}/columns`);
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const handleDeleteColumn = async (
  id: string
): Promise<
  IApiResponse<{
    id: string;
    updatedNeighbors: IColumn[];
  }>
> => {
  try {
    const resp = await axios.delete(`${BASE_URL}/columns/${id}`);
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const handleUpdateColumn = async (
  id: string,
  title: string
): Promise<
  IApiResponse<{
    updated: IColumn;
  }>
> => {
  try {
    const resp = await axios.put(`${BASE_URL}/columns/${id}`, {
      title,
    });
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const handleReorderColumn = async (
  id: string,
  data: { prevId: string | null; nextId: string | null }
) => {
  try {
    const resp = await axios.patch(`${BASE_URL}/columns/reorder/${id}`, data);
    return { isError: false, data: resp.data };
  } catch (error) {
    return { isError: true, error };
  }
};

export const handleGetTask = async (): Promise<IApiResponse<ITask[]>> => {
  try {
    const resp = await axios.get(`${BASE_URL}/tasks`);
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const handleCreateTask = async (
  payload: ITaskPayload
): Promise<
  IApiResponse<{
    task: ITask;
    updatedNeighbors: ITask[];
  }>
> => {
  try {
    const resp = await axios.post(`${BASE_URL}/tasks`, payload);
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const handleUpdateTask = async (
  id: string,
  payload: ITaskPayload
): Promise<
  IApiResponse<{
    task: ITask;
    updatedNeighbors: ITask[];
  }>
> => {
  try {
    const resp = await axios.put(`${BASE_URL}/tasks/${id}`, payload);
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};
export const handleDeleteTask = async (
  id: string
): Promise<
  IApiResponse<{
    task: ITask;
    updatedNeighbors: ITask[];
  }>
> => {
  try {
    const resp = await axios.delete(`${BASE_URL}/tasks/${id}`);
    return {
      isError: false,
      data: resp.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};
