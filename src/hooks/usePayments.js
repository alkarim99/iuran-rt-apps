// hooks/usePayments.js
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { getAllPayments, searchPayments, deletePayment } from "../services/IuranService";

export const usePayments = (currentPage, itemsPerPage, keyword, sortBy) => {
  const [dataIuran, setDataIuran] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Define fetchPayments function outside useEffect so it can be reused
  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllPayments(currentPage, itemsPerPage);
      setTotalPages(response?.data?.totalPages);
      setDataIuran(response?.data?.data);
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch payment data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (!keyword && !sortBy) {
      fetchPayments();
    } else {
      const searchAndSortPayments = async () => {
        setIsLoading(true);
        try {
          const response = await searchPayments({
            keyword,
            sortBy,
            page: currentPage,
            limit: itemsPerPage,
          });
          setDataIuran(response?.data?.data);
          setTotalPages(response?.data?.totalPages);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      searchAndSortPayments();
    }
  }, [fetchPayments, keyword, sortBy, currentPage, itemsPerPage]);

  // Now fetchPayments can be reused in handleDelete
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const result = await Swal.fire({
        title: "Do you want to delete this data?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `Don't Delete`,
      });

      if (result.isConfirmed) {
        const response = await deletePayment(id);
        Swal.fire("Delete Success!", response?.data?.message, "success");
        await fetchPayments(); // Refresh data after delete
      }
    } catch (error) {
      Swal.fire("Error!", error?.response?.data?.message || "Something wrong in our App!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { dataIuran, totalPages, isLoading, handleDelete };
};
