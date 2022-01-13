import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

function SingleProject() {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);

  const [project, setProject] = useState(null);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsub;
    const fetchProject = async () => {
      unsub = await db
        .collection("projects")
        .doc(id)
        .onSnapshot((snapshot) => {
          //   console.log(snapshot.data());
          setProject(snapshot.data());
        });
    };

    fetchProject();
    return () => {
      unsub();
    };
  }, [id]);
  //   console.log(id);
  //   console.log(project);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // saving info who has add the comment
    const commentToAdd = {
      name: user.name,
      photo: user.photo,
      comment,
      id: Math.random(),
    };

    setComment("");
    await db
      .collection("projects")
      .doc(id)
      .update({
        comments: [...project.comments, commentToAdd],
      });
  };
  //   console.log(project);
  return (
    <div>
      {project && (
        <>
          <div className="project-summary">
            <h2 className="page-title">{project.project}</h2>
            <p className="due-date">
              Project due by {project.dueDate.toDate().toDateString()}
            </p>
            <p className="details">{project.details}</p>
            <h4>Project assigned to:</h4>
            <div className="assigned-users">
              {project.assignedUsersList.map((user) => (
                <div key={user.id}>
                  <img width="50" src={user.photo} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button>Add</button>
            </form>
          </div>
          <h4>Project Comments</h4>

          <ul>
            {project.comments.length > 0 &&
              project.comments.map((comment) => (
                <li key={comment.id}>
                  <div className="comment-author">
                    <img width="50" src={comment.photo} />

                    <p>{comment.displayName}</p>
                  </div>

                  <div className="comment-content">
                    <p>{comment.comment}</p>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default SingleProject;
