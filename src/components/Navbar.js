import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { logout } from "../Redux/actions";

function Navbar() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    // update online to false when we logout for the current logged in user
    await db.collection("users").doc(user.uid).update({ online: false });
    await auth.signOut();
    dispatch(logout());
  };
  return (
    <div className="navbar__container">
      <div className="navbar__left">
        <h3>
          <Link to="/">Home</Link>
        </h3>
        <h3>
          <Link to="/projects">projects</Link>
        </h3>
      </div>
      <div className="navbar__right">
        {!user && (
          <>
            <h3>
              <Link to="/login">login</Link>
            </h3>
            <h3>
              <Link to="/signup">singup</Link>
            </h3>
          </>
        )}
        {user?.photo && user?.name && (
          <>
            <img src={user?.photo} alt="profile" width="50" />
            <h3>
              {user?.name}-{user?.email}
            </h3>
          </>
        )}
        {user && <h3 onClick={handleLogout}>logout</h3>}
      </div>
    </div>
  );
}
export default Navbar;
