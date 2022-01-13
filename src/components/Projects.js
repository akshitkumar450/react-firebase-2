import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";

function Projects() {
  const [data, setData] = useState([]);

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

  return (
    <div className="project-list">
      {data.length === 0 && <p>No projects yet!</p>}
      {data.map((item) => (
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
    </div>
  );
}

export default Projects;
