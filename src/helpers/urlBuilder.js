import { BASE_URL } from "../services/config";

/**
 * Build a URL with query parameters, filtering out empty/null/undefined values.
 * Replaces repetitive manual URL-building pattern used across services.
 *
 * @param {string} path - API path (e.g. "/wargas", "/payments/rincian")
 * @param {Object} params - Key-value pairs of query parameters
 * @returns {string} Full URL with query string
 */
export const buildUrl = (path, params = {}) => {
  let url = `${BASE_URL}${path}`;
  const searchParams = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  });

  if (searchParams.length > 0) {
    url += `?${searchParams.join("&")}`;
  }

  return url;
};
