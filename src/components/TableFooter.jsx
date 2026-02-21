import React from "react"
import FormatCurrency from "../helpers/FormatCurrency" // Reuse standard formatter for digits if appropriate, otherwise native

export default function TableFooter({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onLimitChange,
}) {
  // Calculate bounds
  const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  // Advanced logic for generating pagination numeric ranges safely centered
  const getPaginationRange = (current, total, siblingCount = 1) => {
    const totalPageNumbers = siblingCount * 2 + 3
    if (total <= totalPageNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const left = Math.max(current - siblingCount, 1)
    const right = Math.min(left + totalPageNumbers - 1, total)
    const rangeStart = Math.max(Math.min(left, total - totalPageNumbers + 1), 1)
    return Array.from(
      { length: Math.min(totalPageNumbers, total) },
      (_, i) => rangeStart + i
    )
  }

  const paginationRange = getPaginationRange(currentPage, totalPages)

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
      {/* Items limit selector and Record Info */}
      <div className="d-flex align-items-center text-muted mb-2">
        <select
          className="form-select form-select-sm me-3"
          style={{ width: "auto" }}
          value={itemsPerPage}
          onChange={(e) => {
            onLimitChange(Number(e.target.value))
          }}
        >
          <option value={10}>10 Baris</option>
          <option value={20}>20 Baris</option>
          <option value={25}>25 Baris</option>
          <option value={50}>50 Baris</option>
          <option value={100}>100 Baris</option>
        </select>
        <span className="small">
          Menampilkan {startItem} hingga {endItem} dari total {totalCount} data
        </span>
      </div>

      {/* Pagination Module */}
      <nav aria-label="Page navigation" className="mb-2">
        <ul className="pagination pagination-sm m-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          
          {paginationRange.map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${pageNumber === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
