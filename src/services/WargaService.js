import axios from "axios";
import { buildUrl } from "../helpers/urlBuilder";
import { BASE_URL } from "./config";

export const getAllWarga = async (currentPage, limit) => {
  try {
    const url = buildUrl("/wargas", { page: currentPage, limit });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch warga data:", error);
    throw error;
  }
};

export const getWargaOptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/wargas/option`);
    return response;
  } catch (error) {
    console.error("Failed to fetch warga data:", error);
    throw error;
  }
};

export const getWargaByID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/wargas/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch warga data:", error);
    throw error;
  }
};

export const searchWarga = async (data) => {
  try {
    const { keyword, sortBy, order, page, limit } = data;
    const url = buildUrl("/wargas", {
      keyword,
      sort_by: sortBy,
      order,
      page,
      limit,
    });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch warga data:", error);
    throw error;
  }
};

export const createWarga = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/wargas`, data);
    return response;
  } catch (error) {
    console.error("Failed to create warga data:", error);
    throw error;
  }
};

export const updateWarga = async (data) => {
  try {
    const response = await axios.patch(`${BASE_URL}/wargas`, data);
    return response;
  } catch (error) {
    console.error("Failed to update warga data:", error);
    throw error;
  }
};

export const deleteWarga = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/wargas/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to delete warga data:", error);
    throw error;
  }
};
