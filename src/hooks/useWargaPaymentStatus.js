import { useState, useEffect, useRef } from 'react';
import { getLatestPayment } from '../services/IuranService';

/**
 * Hook to batch-load the latest payment period for an array of warga IDs.
 * Returns a map: { [wargaId]: { latest_period, status } }
 * 
 * "status" is derived from the current month:
 * - "lunas"  → latest_period is in the current month or later
 * - "belum"  → latest_period is before current month, or no payment
 */
export const useWargaPaymentStatus = (dataWarga = []) => {
  const [statusMap, setStatusMap] = useState({});
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const prevIdsRef = useRef('');

  useEffect(() => {
    if (!dataWarga || dataWarga.length === 0) return;

    const ids = dataWarga.map(w => w._id).join(',');
    // Skip if same set of warga already loaded
    if (ids === prevIdsRef.current) return;
    prevIdsRef.current = ids;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed

    const deriveStatus = (latestPeriod) => {
      if (!latestPeriod || latestPeriod === 'Tidak ada') return 'belum';
      const d = new Date(latestPeriod);
      if (d.getFullYear() > currentYear) return 'lunas';
      if (d.getFullYear() === currentYear && d.getMonth() >= currentMonth) return 'lunas';
      return 'belum';
    };

    setIsLoadingStatus(true);

    // Fetch sequentially with small delay to avoid hammering the API
    const fetchAll = async () => {
      const results = {};
      for (const warga of dataWarga) {
        try {
          const res = await getLatestPayment(warga._id);
          const latestPeriod = res?.data?.latest_period;
          results[warga._id] = {
            latest_period: latestPeriod,
            status: deriveStatus(latestPeriod),
          };
        } catch {
          results[warga._id] = { latest_period: null, status: 'belum' };
        }
      }
      setStatusMap(results);
      setIsLoadingStatus(false);
    };

    fetchAll();
  }, [dataWarga]);

  return { statusMap, isLoadingStatus };
};
