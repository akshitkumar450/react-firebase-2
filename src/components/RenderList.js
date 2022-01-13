import React from "react";
import { db } from "../firebase";

function RenderList({ data }) {
  const handleDelete = async (id) => {
    await db.collection("recipies").doc(id).delete();
  };
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
