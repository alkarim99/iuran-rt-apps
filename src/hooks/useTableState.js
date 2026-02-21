import { useState, useEffect } from "react";

export const useTableState = (
  storageKey,
  defaultLimit = 20,
  defaultSortBy = "",
  defaultOrder = 1,
) => {
  // Try loading from session storage
  const getInitialState = (key, fallback) => {
    const saved = sessionStorage.getItem(`${storageKey}_${key}`);
    return saved !== null ? JSON.parse(saved) : fallback;
  };

  const [page, setPage] = useState(() => getInitialState("page", 1));
  const [limit, setLimit] = useState(() =>
    getInitialState("limit", defaultLimit),
  );
  const [keyword, setKeyword] = useState(() => getInitialState("keyword", ""));
  const [sortBy, setSortBy] = useState(() =>
    getInitialState("sortBy", defaultSortBy),
  );
  const [order, setOrder] = useState(() =>
    getInitialState("order", defaultOrder),
  ); // 1: Asc, -1: Desc

  // Save changes to sessionStorage whenever variables change
  useEffect(() => {
    sessionStorage.setItem(`${storageKey}_page`, JSON.stringify(page));
    sessionStorage.setItem(`${storageKey}_limit`, JSON.stringify(limit));
    sessionStorage.setItem(`${storageKey}_keyword`, JSON.stringify(keyword));
    sessionStorage.setItem(`${storageKey}_sortBy`, JSON.stringify(sortBy));
    sessionStorage.setItem(`${storageKey}_order`, JSON.stringify(order));
  }, [page, limit, keyword, sortBy, order, storageKey]);

  // Handlers for sorting logic
  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      // Toggle order if clicking exactly same column
      setOrder((prev) => (prev === 1 ? -1 : 1));
    } else {
      // New column, reset to ascending
      setSortBy(columnKey);
      setOrder(1);
    }
  };

  // Generic reset function
  const resetTable = (initialSortBy = "", initialOrder = 1) => {
    setPage(1);
    setKeyword("");
    setSortBy(initialSortBy);
    setOrder(initialOrder);
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    keyword,
    setKeyword,
    sortBy,
    setSortBy,
    order,
    setOrder,
    handleSort,
    resetTable,
  };
};

export const clearTableState = () => {
  const keysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (
      key.includes("_page") ||
      key.includes("_limit") ||
      key.includes("_keyword") ||
      key.includes("_sortBy") ||
      key.includes("_order")
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
};
