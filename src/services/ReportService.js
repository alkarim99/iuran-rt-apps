import axios from "axios";
import { BASE_URL } from "./config";

const getPettyCashReport = async (payload) => {
  return await axios.get(`${BASE_URL}/reports/petty-cash`, { params: payload });
};

const getKasRekeningReport = async (payload) => {
  return await axios.get(`${BASE_URL}/reports/kas-rekening`, {
    params: payload,
  });
};

const getNeracaKasReport = async (payload) => {
  return await axios.get(`${BASE_URL}/reports/neraca-kas`, { params: payload });
};

export { getPettyCashReport, getKasRekeningReport, getNeracaKasReport };
