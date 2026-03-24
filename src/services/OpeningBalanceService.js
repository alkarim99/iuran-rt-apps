import axios from "axios";
import { BASE_URL } from "./config";

export const getOpeningBalances = (year, type) => {
  let url = `${BASE_URL}/opening-balances?year=${year}`;
  if (type) {
    url += `&type=${type}`;
  }
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const upsertOpeningBalance = (payload) => {
  return axios.post(`${BASE_URL}/opening-balances`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const deleteOpeningBalance = (year, type) => {
  const url = `${BASE_URL}/opening-balances?year=${year}&type=${type}`;
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
