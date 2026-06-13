// Reusable pagination control shared across all data tables.
// Renders a centered window of page numbers (current page ± siblings) with
// Previous/Next that move one page at a time. Hidden when there is nothing to
// paginate (0 or 1 page).

// Centered pagination window, clamped to bounds.
const getPaginationRange = (current, total, siblingCount = 1) => {
  const totalPageNumbers = siblingCount * 2 + 3
  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const left = Math.max(current - siblingCount, 1)
  const rangeStart = Math.max(Math.min(left, total - totalPageNumbers + 1), 1)
  return Array.from(
    { length: Math.min(totalPageNumbers, total) },
    (_, i) => rangeStart + i
  )
}

function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }) {
  if (!totalPages || totalPages <= 1) {
    return null
  }

  const paginationRange = getPaginationRange(currentPage, totalPages, siblingCount)

  return (
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {paginationRange.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
