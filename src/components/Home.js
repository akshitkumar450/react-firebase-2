import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import firebase from "firebase";
import RenderList from "./RenderList";
import Select from "react-select";

// category option array for React-Select
const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

function Home() {
  const user = useSelector((state) => state.user.user);
  // project form values
  const [project, setProject] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [optionsUser, setOptionsUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);

  const [data, setData] = useState([]);

  // users collection was created when we signup,,to store the user in their correspoinding user id
  //   fetching users from users collection for showing all the users
  useEffect(() => {
    const unsub = db.collection("users").onSnapshot((snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setData(results);
    });
    return () => {
      unsub();
    };
  }, []);
  // console.log(data);

  //fetching the users from users db and setting the options for dropdown for assigning users
  // react select requires object with values for {value:'',label:''}
  // so we are setting those properties by looping the users (stored in state) collection
  // this will run the component loads
  useEffect(() => {
    let newArr = [];
    newArr = data.map((user) => {
      return {
        value: user, //setting the whole user object as value for each user
        label: user.name,
      };
    });
    // console.log(newArr);
    // setting the options array for assigned to dropdwon
    setOptionsUsers(newArr);
  }, [data]);

  // console.log(assignedUsers);
  // these will the values which will be selected from the assigned to dropdown having label and value

  //   submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(dueDate, project, details, category, assignedUsers);
    try {
      // taking out the required fields
      // assignedUsers will be array of objects having label,value
      // in which value will be the whole user object (line 55)
      // so we are fetching the requied fields from user.value
      const assignedUsersList = assignedUsers.map((user) => {
        return {
          name: user.value.name,
          photo: user.value.photo,
          id: user.value.id,
        };
      });

      // details for the current logged in user
      const createdBy = {
        name: user.name,
        photo: user.photo,
        id: user.uid,
      };

      // store the details for the project in the projects collection
      await db.collection("projects").add({
        project,
        details,
        category: category.value, // category will be the object having label and value
        dueDate: firebase.firestore.Timestamp.fromDate(new Date(dueDate)),
        comments: [], //empty at creation of a new project
        assignedUsersList, //array of the users to whom projects are assigned (name,photo,id)
        createdBy, //current logged user can created projects
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
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>
        <label>
          <span>Assign to</span>
          <Select
            options={optionsUser}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>
        <button> {loading ? "adding" : "add"}</button>
      </form>
      {data && <RenderList data={data} />}
    </div>
  );
}

export default Home;
