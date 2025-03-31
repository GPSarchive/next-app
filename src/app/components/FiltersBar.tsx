import styles from "@/app/components/filtersBar.module.css";
import { FaSlidersH, FaMap } from "react-icons/fa";

// =======================
// Types
// =======================

type Props = {
  filter: string;
  setFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  resultsCount: number;
};

// =======================
// Component
// =======================

const FiltersBar = ({
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
  resultsCount,
}: Props) => {
  return (
    <div className={styles.filterBar}>
      {/* Category Filter */}
      <select
        className={styles.filterDropdown}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Villa">Villa</option>
        <option value="Apartment">Apartment</option>
        <option value="Cottage">Cottage</option>
      </select>

      {/* Sorting Dropdown */}
      <select
        className={styles.sortDropdown}
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="default">Default Sort</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
      </select>

      {/* Results Count */}
      <span className={styles.resultCount}>
        1 - {resultsCount} of {resultsCount} Results
      </span>

      {/* Filter & Map Buttons */}
      <div className={styles.buttonGroup}>
        <button className={styles.filterButton}>
          <FaSlidersH size={16} />
        </button>
        <button className={styles.mapButton}>
          <FaMap size={16} />
        </button>
      </div>
    </div>
  );
};

export default FiltersBar;
