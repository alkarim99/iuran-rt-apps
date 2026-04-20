import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"

/**
 * Reusable print button — automatically hidden during print via CSS class.
 * @param {string} label - Optional button label (default: "Cetak")
 */
function PrintButton({ label = "Cetak" }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button
      className="btn btn-outline-secondary no-print ms-2"
      onClick={handlePrint}
      title="Cetak halaman ini"
    >
      <FontAwesomeIcon icon={faPrint} /> {label}
    </button>
  )
}

export default PrintButton
