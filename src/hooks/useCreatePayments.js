import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getWargaOptions } from "../services/WargaService";
import { getLatestPayment, createPayment } from "../services/IuranService";

export const useCreatePayments = () => {
  const navigate = useNavigate();
  const params = useParams();
  const state = useSelector((reducer) => reducer.auth);

  const [wargaID, setWargaID] = useState(params?.id ?? "");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [nominal, setNominal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payAt, setPayAt] = useState("");
  const [dataWarga, setDataWarga] = useState([]);
  const [latestPeriod, setLatestPeriod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLatestPeriod, setIsLoadingLatestPeriod] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleGetWarga();
    if (wargaID !== "") {
      handleGetLatestPeriod(wargaID);
    }
  }, [state]);

  useEffect(() => {
    setFilteredOptions(
      dataWarga.filter(
        (warga) =>
          warga?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          warga?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
      ),
    );
  }, [searchTerm, dataWarga]);

  const handleGetWarga = () => {
    getWargaOptions()
      .then((response) => {
        setDataWarga(response?.data?.data);
        setFilteredOptions(response?.data?.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGetLatestPeriod = (id) => {
    setIsLoadingLatestPeriod(true);
    getLatestPayment(id)
      .then((response) => {
        if (response?.data?.latest_period !== undefined) {
          setLatestPeriod(response?.data?.latest_period);
        } else {
          setLatestPeriod("Tidak ada");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoadingLatestPeriod(false);
      });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      warga_id: wargaID,
      period_start: periodStart,
      period_end: periodEnd,
      nominal: nominal,
      payment_method: paymentMethod,
      pay_at: payAt,
    };
    createPayment(payload)
      .then((response) => {
        Swal.fire({
          title: "Create Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/iuran");
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    wargaID,
    setWargaID,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    nominal,
    setNominal,
    paymentMethod,
    setPaymentMethod,
    payAt,
    setPayAt,
    dataWarga,
    filteredOptions,
    searchTerm,
    setSearchTerm,
    latestPeriod,
    isLoading,
    handleCreate,
    handleGetLatestPeriod,
  };
};
