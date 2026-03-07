import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getWargaOptions } from "../services/WargaService";
import { getLatestPayment, createPayment } from "../services/IuranService";
import FormatCurrency from "../helpers/FormatCurrency";

export const useCreatePayments = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  const [wargaID, setWargaID] = useState(params?.id ?? "");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [nominal, setNominal] = useState("");
  const [rt, setRt] = useState("");
  const [pkk, setPkk] = useState("");
  const [sosial, setSosial] = useState("");
  const [kematian, setKematian] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payAt, setPayAt] = useState("");
  const isCustomNominal =
    nominal && nominal > 0 && nominal % 75000 !== 0 && nominal % 110000 !== 0;
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
    if (wargaID) {
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
    if (isCustomNominal) {
      const sum = Number(rt) + Number(pkk) + Number(sosial) + Number(kematian);
      if (sum !== Number(nominal)) {
        Swal.fire({
          title: "Warning!",
          text: `Total rincian (${FormatCurrency(sum)}) tidak sama dengan nominal (${FormatCurrency(nominal)}). Harap perbaiki nilai rincian.`,
          icon: "warning",
        });
        setIsLoading(false);
        return;
      }
      payload.details_payment = {
        rt: Number(rt),
        pkk: Number(pkk),
        sosial: Number(sosial),
        kematian: Number(kematian),
      };
    }
    createPayment(payload)
      .then((response) => {
        Swal.fire({
          title: "Create Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate(location.state?.from || "/iuran");
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
    rt,
    setRt,
    pkk,
    setPkk,
    sosial,
    setSosial,
    kematian,
    setKematian,
    isCustomNominal,
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
