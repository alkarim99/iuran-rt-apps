# Frontend Release Notes & Changelog

## [v2.2.0] - Table Standardization

_Release Date: March 2026_

A major update focused on standardizing the functionality of all application data tables to be intuitive and modular.

### New Features & Table Overhaul

- **Unified State Management**: Drastic migration of table components to centralize _pagination_, _limit_ control, _keyword search_, and _sorting order_ using a reactive custom hook `useTableState`. This hook utilizes _sessionStorage_ to store user filters _persistently_.
- **Reusable Pagination**: Implemented an independent `<TableFooter />` component across almost all data pages: Expenses, Other Incomes, Iuran Details, Total Calculation, Warga Data.
- **Header Click-to-Sort**: All main tables now support dynamic multifactor sorting (Nominal, Date, Name, Address columns) directly by clicking the column _header_, marked by indicator icons (▲/▼).
- **Month Picker Period**: Standardized the period range filter from a complex _Date Picker_ to a simple month+year UI interface (`<input type="month">`) in Iuran Details, Total Iuran, Expenses, and Other Incomes.

---

## [v2.1.0] - UX Polish

_Release Date: March 2026_

Improved Treasurer navigation experience (UX) focusing on cutting redundant steps post-transaction management.

### User Experience Acceleration (UX)

- **Smart SweetAlert Shortcut**: Added _shortcut_ button functions to "RT Cash Balance" and "Dashboard" immediately after a user successfully saves data, minimizing manual navigation via the Navbar.
- **Dashboard Copywriting**: Refined the dashboard greeting and widened the _typography_ scale (CSS Lead Width) to prevent visual stacking. Explicit month name format on the financial summary panel.
- Extended stricter handling of the _Routing State_ cycle (`location.state`) post-form interaction to keep the UI consistent without redundant _loading_ pauses.

---

## [v2.0.0] - Iuran RT Apps V2

Version 2 focuses on an overhaul of the _User Experience_ (UX), enriching the _User Interface_ (UI) with comprehensive report metrics, dynamic currency formatting, and smart navigation.

### New Features

- **Dashboard Reporting & Financial Analytics**:
  - **RT Cash Balance** report with chronological structure and _Net Balance_ calculation.
  - Interactive **Pricing Tier** report with Calendar _Preset_ filters (This Month, 1 Month Ago, etc.) complete with a pop-up displaying warga identity data.
  - Separated reports for **Cash Receipts (Bu Agus)** & **Transfers (Bu Harris)**.
- **Expense & Other Income Modules**:
  - New complete form pages for recording Expenses and Other Incomes outside of warga dues.
- **Smart UX Redirect**:
  - Data logging forms now recognize _History Referer_ using `location.state.from`. Upon successful submission, the _back_ navigation automatically returns to where the user came from without forcing a return to the root route.
- **Live Currency Formatter**:
  - An interactive, _real-time_ _Rupiah Preview_ (Rp) automatically appears beneath nominal _input fields_ during form entry (Expenses, Incomes, etc.) to prevent zero-digit _typos_.
- **Excel Export**: All report tables are now equipped with a download button (Export) to a print-ready `.xlsx` extension.

### Fixes & UX Polish

- Filtered _Ghost Requests_ on the `useCreatePayments.js` hook, locking asynchronous calls to `/api/payments/latest/` when the payload ID is in the rendering phase.
- Adjusted UI theme schemes for a transparent _Navbar_ and classification label _badge_ colors on the Tier report.
- Bounded decimal money values with cent limits (.00) in the Balance table to avoid _visual overflow_.

---

## [v1.0.0] - Legacy Initial Release

### Main Features

- **Authentication Gateway**: Initial Login page.
- **Warga & Iuran Management**:
  - Warga list with search and registration interface (_Create, Edit, Delete_).
  - Historical list of bill payments per warga.
- **Core Components**:
  - Routing using static React Router DOM.
  - Management of Auth session global state using _Redux_.
  - Basic interface design based on _Bootstrap_.
