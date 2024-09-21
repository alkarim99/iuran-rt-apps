const env = process.env.REACT_APP_ENV

export const BASE_URL =
  env === "local"
    ? process.env.REACT_APP_BASE_URL_LOCAL
    : env === "development"
    ? process.env.REACT_APP_BASE_URL_DEV
    : process.env.REACT_APP_BASE_URL_PROD
