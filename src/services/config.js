import axios from "axios";

const env = process.env.REACT_APP_ENV;

const rawBaseUrl =
  env === "local"
    ? process.env.REACT_APP_BASE_URL_LOCAL
    : env === "development"
      ? process.env.REACT_APP_BASE_URL_DEV
      : process.env.REACT_APP_BASE_URL_PROD;

export const BASE_URL = `${rawBaseUrl}/api`;
