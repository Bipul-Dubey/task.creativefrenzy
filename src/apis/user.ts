import {
  IApiResponse,
  IUser,
  IUserLoginPayload,
  IUserRegisterPayload,
} from "@/types";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const handleRegister = async (
  payload: IUserRegisterPayload
): Promise<IApiResponse<IUser>> => {
  try {
    const resp = await axios.post(`${BASE_URL}/users/register`, payload);
    return {
      data: resp.data,
      isError: false,
    };
  } catch (error) {
    return {
      isError: true,
      error: error,
    };
  }
};

export const handleLogin = async (
  payload: IUserLoginPayload
): Promise<IApiResponse<IUser>> => {
  try {
    const resp = await axios.post(`${BASE_URL}/users/login`, payload);
    return {
      data: resp.data,
      isError: false,
    };
  } catch (error) {
    return {
      isError: true,
      error: error,
    };
  }
};
