// src/components/FilterBar.jsx
import React from "react";

export default function FilterBar({ filter, setFilter }) {
  return (
    <div className="filter-bar" style={{ display: "flex", alignItems: "center" }}>
      <label htmlFor="filterSelect" style={{ marginRight: "8px" }}>Filter:</label>
      <select
        id="filterSelect"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Events</option>
        <option value="upcoming">Upcoming Events</option>
        <option value="past">Past Events</option>
        <option value="recent">Recently Added</option>
      </select>
    </div>
  );
}
