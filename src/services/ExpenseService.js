import axios from "axios";
import { buildUrl } from "../helpers/urlBuilder";
import { BASE_URL } from "./config";

export const getAllExpense = async (data) => {
  try {
    const { keyword, sortBy, order, page, limit } = data;
    const url = buildUrl("/expense", {
      keyword,
      sort_by: sortBy,
      order,
      page,
      limit,
    });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch expenses data:", error);
    throw error;
  }
};

export const getExpenseByID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/expense/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch expense data:", error);
    throw error;
  }
};

export const getExpenseByTransactionAt = async (transaction_at) => {
  try {
    const url = buildUrl("/expense/periode", { transaction_at });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch expenses data:", error);
    throw error;
  }
};

export const createExpense = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/expense`, data);
    return response;
  } catch (error) {
    console.error("Failed to create expense data:", error);
    throw error;
  }
};

export const editExpense = async (data) => {
  try {
    const response = await axios.put(`${BASE_URL}/expense`, data);
    return response;
  } catch (error) {
    console.error("Failed to edit expense data:", error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/expense/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to delete expense data:", error);
    throw error;
  }
};
