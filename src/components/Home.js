import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import firebase from "firebase";
import RenderList from "./RenderList";
import Select from "react-select";

const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

function Home() {
  const [project, setProject] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUsers, setAssignedUsers] = useState("");
  const [optionsUser, setOptionsUsers] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);

  const user = useSelector((state) => state.user.user);
  //   fetching users
  useEffect(() => {
    let unsub;
    const fetchData = async () => {
      unsub = await db.collection("users").onSnapshot((snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setData(results);
      });
    };
    fetchData();
    return () => {
      unsub();
    };
  }, []);
  // console.log(data);

  //   fetching the users from users db and setting as the options for dropdown for assigning users
  useEffect(() => {
    let newArr = [];
    newArr = data.map((user) => {
      return {
        value: user,
        label: user.name,
      };
    });
    // console.log(newArr);

    setOptionsUsers(newArr);
  }, [data]);

  //   submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(dueDate, project, details, category, assignedUsers);
    try {
      const assignedUsersList = assignedUsers.map((user) => {
        return {
          name: user.value.name,
          photo: user.value.photo,
          id: user.value.id,
        };
      });
      const createdBy = {
        name: user.name,
        photo: user.photo,
        id: user.uid,
      };
      await db.collection("projects").add({
        project,
        details,
        category: category.value,
        dueDate: firebase.firestore.Timestamp.fromDate(new Date(dueDate)),
        comments: [],
        assignedUsersList,
        createdBy,
      });
      if (!cancel) {
        setDetails("");
        setProject("");
        setDueDate("");
        setLoading(false);
      }
    } catch (err) {
      if (!cancel) {
        alert(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h3>All transactions</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <span>project name:</span>
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            type="text"
          />
        </label>
        <label>
          <span>details:</span>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>
        <label>
          <span>Set due date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>category</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Assign to</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            isMulti
            options={optionsUser}
          />
        </label>
        <button> {loading ? "adding" : "add"}</button>
      </form>
      {data && <RenderList data={data} />}
    </div>
  );
}

export default Home;
