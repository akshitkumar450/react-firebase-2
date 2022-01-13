import React from "react";

function RenderList({ data }) {
  return (
    <div>
      <h3>All transactions</h3>
      {data.map((item) => (
        <h4 key={item.id}>
          {item.name}-{item.email}-{item.online && "on"}
          <img src={item.photo} alt="user-photo" width="50" />
        </h4>
      ))}
    </div>
  );
}

export default RenderList;
