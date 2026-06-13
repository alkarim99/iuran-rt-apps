import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { getWargaOptions } from "../services/WargaService"
import {
  getLatestPayment,
  getPaymentByID,
  editPayment,
} from "../services/IuranService"

export const useEditPayments = () => {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[3]

  const [wargaID, setWargaID] = useState("")
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [nominal, setNominal] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [payAt, setPayAt] = useState("")
  const [dataWarga, setDataWarga] = useState([])
  const [latestPeriod, setLatestPeriod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOptions, setFilteredOptions] = useState([])

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    setIsLoading(true)
    handleGetWarga()
    handleGetIuran()
    handleGetLatestPeriod()
    setIsLoading(false)
  }, [state])

  useEffect(() => {
    setFilteredOptions(
      dataWarga.filter(
        (warga) =>
          warga?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          warga?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    )
  }, [searchTerm, dataWarga])

  const handleGetWarga = () => {
    getWargaOptions()
      .then((response) => {
        setDataWarga(response?.data?.data)
        setFilteredOptions(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleGetIuran = () => {
    getPaymentByID(id)
      .then((response) => {
        setWargaID(response?.data?.data?.warga?._id)
        setPeriodStart(response?.data?.data?.period_start)
        setPeriodEnd(response?.data?.data?.period_end)
        setNominal(response?.data?.data?.nominal)
        setPaymentMethod(response?.data?.data?.payment_method)
        setPayAt(response?.data?.data?.pay_at)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleEdit = (e) => {
    e?.preventDefault()
    setIsLoading(true)
    const payload = {
      id: id,
      warga_id: wargaID,
      period_start: periodStart,
      period_end: periodEnd,
      nominal: nominal,
      payment_method: paymentMethod,
      pay_at: payAt,
    }
    editPayment(payload)
      .then((response) => {
        Swal.fire({
          title: "Update Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/iuran")
        })
      })
      .catch((error) => {
        console.log(error)
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleGetLatestPeriod = () => {
    getLatestPayment(wargaID)
      .then((response) => {
        if (response?.data?.latest_period != undefined) {
          setLatestPeriod(response?.data?.latest_period)
        } else {
          setLatestPeriod("Tidak ada")
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return {
    wargaID,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    handleGetLatestPeriod,
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
    latestPeriod,
    isLoading,
    handleEdit,
  }
}
