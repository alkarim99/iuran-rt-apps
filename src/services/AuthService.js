import axios from "axios";
import { BASE_URL } from "./config";

export const login = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, data);
    return response;
  } catch (error) {
    console.error("Failed to login:", error);
    throw error;
  }
};
