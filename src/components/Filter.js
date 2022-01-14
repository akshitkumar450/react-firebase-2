import React, { useState } from "react";

const filterList = [
  "all",
  "mine",
  "development",
  "design",
  "sales",
  "marketing",
];

function Filter({ handleFilter, filter }) {
  const handleClick = (filter) => {
    handleFilter(filter);
  };
  return (
    <div>
      filter by: {filter}
      <br />
      <br />
      {filterList.map((f) => (
        <span
          key={f}
          style={{ margin: "0 10px" }}
          onClick={() => handleClick(f)}>
          {f}
        </span>
      ))}
    </div>
  );
}

export default Filter;
