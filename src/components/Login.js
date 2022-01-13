import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth, db } from "../firebase";
import { login } from "../Redux/actions";

function Login() {
  // form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authUser = await auth.signInWithEmailAndPassword(email, password);

      // do it after the login process bcz we want to update online to true for current logged in user
      // when a user logges in update online to true
      await db
        .collection("users")
        .doc(authUser.user.uid)
        .update({ online: true });

      dispatch(
        login({
          name: authUser.user.displayName,
          email: authUser.user.email,
          uid: authUser.user.uid,
          photo: authUser.user.photoURL,
        })
      );
      if (!cancel) {
        setEmail("");
        setPassword("");
        setLoading(false);
      }
    } catch (err) {
      if (!cancel) {
        alert(err.message);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    return () => {
      setCancel(true);
    };
  }, []);
  return (
    <div>
      <h3>Login Form:</h3>
      <form className="form__container" onSubmit={handleSubmit}>
        <label>
          <span>email</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <span>password</span>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button>{loading ? "loading" : "login"}</button>
      </form>
    </div>
  );
}

export default Login;
