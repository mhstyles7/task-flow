import React from 'react';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

function FilterBar({ active, onChange, counts }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`filter-btn ${active === f.value ? 'filter-btn--active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
          <span className="filter-count">
            {f.value === '' ? counts.all : counts[f.value] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
