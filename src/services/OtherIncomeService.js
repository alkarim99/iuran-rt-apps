import axios from "axios";
import { BASE_URL } from "./config";
import { buildUrl } from "../helpers/urlBuilder";

const getAllOtherIncomes = async (
  currentPage,
  limit,
  keyword,
  sortBy,
  order,
) => {
  const url = buildUrl("/other-income", {
    page: currentPage,
    limit,
    keyword,
    sort_by: sortBy,
    order,
  });
  return await axios.get(url);
};

const getOtherIncomeByID = async (id) => {
  return await axios.get(`${BASE_URL}/other-income/${id}`);
};

const createOtherIncome = async (payload) => {
  return await axios.post(`${BASE_URL}/other-income`, payload);
};

const updateOtherIncome = async (payload) => {
  return await axios.put(`${BASE_URL}/other-income`, payload);
};

const deleteOtherIncome = async (id) => {
  return await axios.delete(`${BASE_URL}/other-income/${id}`);
};

export {
  getAllOtherIncomes,
  getOtherIncomeByID,
  createOtherIncome,
  updateOtherIncome,
  deleteOtherIncome,
};
