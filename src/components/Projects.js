import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import Filter from "./Filter";

function Projects() {
  const [data, setData] = useState([]);
  const user = useSelector((state) => state.user.user);

  // for filtering the data
  const [filter, setFilter] = useState("all");
  // passing this fn in filter component for setting the state in this component
  const handleFilter = (filter) => {
    setFilter(filter);
  };
  // fetching all the projects from projects collection having all the data from project form (HOME page)
  useEffect(() => {
    let unsub;
    const fetchProjects = async () => {
      unsub = db.collection("projects").onSnapshot((snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setData(results);
      });
    };
    fetchProjects();
    return () => {
      unsub();
    };
  }, []);

  // console.log(data);
  // console.log(user);
  // when ever the filter state changes this component will rerun and this function will run again and filtering will take place according to filter state
  // data has all the projects having data which is set in home page from
  const projects = data.filter((curProj) => {
    switch (filter) {
      case "all":
        return true;
      case "mine":
        let isAssignedTome = false;
        // assignedUserList is array of objects which has all the users who are assigned a proejct
        curProj.assignedUsersList.forEach((u) => {
          if (user.name === u.name) {
            //we can use id also for checking
            isAssignedTome = true;
          }
        });
        return isAssignedTome;
      case "design":
      case "development":
      case "sales":
      case "marketing":
        return curProj.category === filter;
      default:
        return true;
    }
  });
  // filtered projects
  // console.log(projects);
  return (
    <div className="project-list">
      <Filter filter={filter} handleFilter={handleFilter} />
      {projects.length === 0 && <p>No projects yet!</p>}

      {projects.map((item) => (
        <Link to={`/projects/${item.id}`} key={item.id}>
          <h4>
            {item.project}-{item.details}
          </h4>
          <p>Due by {item.dueDate.toDate().toDateString()}</p>
          <div className="assigned-to">
            <p>
              <strong>Assigned to:</strong>
            </p>
            <ul>
              {item.assignedUsersList.map((user) => (
                <React.Fragment key={user.photo}>
                  <li>
                    <img width="50" src={user.photo} />
                  </li>
                  <p>{user.name}</p>
                </React.Fragment>
              ))}
            </ul>
          </div>
        </Link>
      ))}

      {/*
        data.map((item) => (
        <Link to={`/projects/${item.id}`} key={item.id}>
          <h4>
            {item.project}-{item.details}
          </h4>
          <p>Due by {item.dueDate.toDate().toDateString()}</p>
          <div className="assigned-to">
            <p>
              <strong>Assigned to:</strong>
            </p>
            <ul>
              {item.assignedUsersList.map((user) => (
                <React.Fragment key={user.photo}>
                  <li>
                    <img width="50" src={user.photo} />
                  </li>
                  <p>{user.name}</p>
                </React.Fragment>
              ))}
            </ul>
          </div>
        </Link>
      ))
              */}
    </div>
  );
}

export default Projects;
