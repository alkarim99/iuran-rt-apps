import axios from "axios";
import { buildUrl } from "../helpers/urlBuilder";
import { BASE_URL } from "./config";

export const getAllPayments = async (currentPage, limit) => {
  try {
    const url = buildUrl("/payments", { page: currentPage, limit });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch payments data:", error);
    throw error;
  }
};

export const getPaymentByID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/payments/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch payment data:", error);
    throw error;
  }
};

export const getPaymentByWargaId = async (data) => {
  try {
    const { id, sortBy } = data;
    const url = buildUrl(`/payments/warga/${id}`, { sort_by: sortBy });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch payment data:", error);
    throw error;
  }
};

export const getRincianPayment = async (data) => {
  try {
    const { currentPage, limit, payAt } = data;
    const url = buildUrl("/payments/rincian", {
      page: currentPage,
      limit,
      pay_at: payAt,
    });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch payment data:", error);
    throw error;
  }
};

export const getPaymentReport = async (data) => {
  try {
    const { id, sortBy } = data;
    const url = buildUrl(`/payments/report/${id}`, { sort_by: sortBy });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch payment data:", error);
    throw error;
  }
};

export const searchPayments = async (data) => {
  try {
    const { keyword, sortBy, order, page, limit } = data;
    const url = buildUrl("/payments", {
      keyword,
      sort_by: sortBy,
      order,
      page,
      limit,
    });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch payments data:", error);
    throw error;
  }
};

export const searchPaymentsRincian = async (data) => {
  try {
    const { keyword, sortBy, order, page, limit, payAt } = data;
    const url = buildUrl("/payments/rincian", {
      keyword,
      sort_by: sortBy,
      order,
      page,
      limit,
      pay_at: payAt,
    });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch payments data:", error);
    throw error;
  }
};

export const getLatestPayment = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/payments/latest/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch latest payment data:", error);
    throw error;
  }
};

export const createPayment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/payments`, data);
    return response;
  } catch (error) {
    console.error("Failed to create payment data:", error);
    throw error;
  }
};

export const editPayment = async (data) => {
  try {
    const response = await axios.put(`${BASE_URL}/payments`, data);
    return response;
  } catch (error) {
    console.error("Failed to edit payment data:", error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/payments/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to delete payment data:", error);
    throw error;
  }
};

export const totalPayment = async (data) => {
  try {
    const { start, end, sortBy, currentPage } = data;
    const url = buildUrl("/payments/total", {
      start,
      end,
      page: currentPage,
      sort_by: sortBy,
    });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch total payment data:", error);
    throw error;
  }
};

export const getPaymentByMethod = async (data) => {
  try {
    const { pay_at, payment_method } = data;
    const url = buildUrl("/payments/method", { pay_at, payment_method });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch payment data:", error);
    throw error;
  }
};

export const getPricingTierReport = async (data) => {
  try {
    const { start_date, end_date } = data;
    let url = `${BASE_URL}/payments/report/pricing-tier`;
    if (start_date && end_date) {
      url += `?start_date=${start_date}&end_date=${end_date}`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Failed to fetch pricing tier report:", error);
    throw error;
  }
};
