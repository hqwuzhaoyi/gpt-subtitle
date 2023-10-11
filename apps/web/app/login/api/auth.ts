import { request } from "@/lib/request";

export const login = async (
  username: string,
  password: string
): Promise<void> => {
  try {
    const response = await request.post(`/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error login");
  }
};

export const signUp = async (
  username: string,
  password: string
): Promise<void> => {
  try {
    const response = await request.post(`/auth/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error signup");
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await request.post(`/auth/logout`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error logout");
  }
};
