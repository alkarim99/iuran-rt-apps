import axios from "axios"
import { BASE_URL } from "./config"

export const getAllWarga = async (currentPage) => {
  try {
    const response = await axios.get(`${BASE_URL}/wargas?page=${currentPage}`)
    return response
  } catch (error) {
    console.error("Failed to fetch warga data:", error)
    throw error
  }
}

export const getWargaOptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/wargas/option`)
    return response
  } catch (error) {
    console.error("Failed to fetch warga data:", error)
    throw error
  }
}

export const getWargaByID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/wargas/${id}`)
    return response
  } catch (error) {
    console.error("Failed to fetch warga data:", error)
    throw error
  }
}

export const searchWarga = async (data) => {
  try {
    const { keyword, sortBy, order, page, limit } = data
    let url = `${BASE_URL}/wargas`
    if (keyword != "") {
      if (url.includes("?")) {
        url = url + `&keyword=${keyword}`
      } else {
        url = url + `?keyword=${keyword}`
      }
    }
    if (sortBy != "") {
      if (url.includes("?")) {
        url = url + `&sort_by=${sortBy}`
      } else {
        url = url + `?sort_by=${sortBy}`
      }
    }
    if (order != "") {
      if (url.includes("?")) {
        url = url + `&order=${order}`
      } else {
        url = url + `?order=${order}`
      }
    }
    if (page) {
      url = url + (url.includes("?") ? `&page=${page}` : `?page=${page}`)
    }
    if (limit) {
      url = url + (url.includes("?") ? `&limit=${limit}` : `?limit=${limit}`)
    }
    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error("Failed to fetch warga data:", error)
    throw error
  }
}

export const createWarga = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/wargas`, data)
    return response
  } catch (error) {
    console.error("Failed to create warga data:", error)
    throw error
  }
}

export const updateWarga = async (data) => {
  try {
    const response = await axios.patch(`${BASE_URL}/wargas`, data)
    return response
  } catch (error) {
    console.error("Failed to update warga data:", error)
    throw error
  }
}

export const deleteWarga = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/wargas/${id}`)
    return response
  } catch (error) {
    console.error("Failed to delete warga data:", error)
    throw error
  }
}
