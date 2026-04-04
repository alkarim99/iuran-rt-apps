import React from "react"
import "./TableFooter.css"

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
    <div className="table-footer-wrap">
      {/* Items limit selector and Record Info */}
      <div className="tf-info-group">
        <select
          className="tf-limit-select"
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
        <span className="tf-count-label">
          Menampilkan <strong>{startItem}</strong> — <strong>{endItem}</strong> dari <strong>{totalCount}</strong>
        </span>
      </div>

      {/* Pagination Module */}
      <div className="tf-pagination">
        <button
          className="tf-page-btn tf-nav-btn"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        
        {paginationRange.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`tf-page-btn ${pageNumber === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          className="tf-page-btn tf-nav-btn"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages || totalPages === 0}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  )
}
