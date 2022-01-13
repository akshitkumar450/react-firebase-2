import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { login, logout, ready } from "./Redux/actions";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import Projects from "./components/Projects";
import SingleProject from "./components/SingleProject";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isReady = useSelector((state) => state.user.isReady);

  // eventhandler for checking if the user is logged in or not
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // log in
        dispatch(
          ready({
            name: authUser.displayName,
            email: authUser.email,
            uid: authUser.uid,
            photo: authUser.photoURL,
          })
        );
      } else {
        //logout
        dispatch(logout());
      }
    });
    return () => {
      unsub();
    };
  }, [dispatch]);
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            {!user && <Redirect to="/login" />}
            {user && <Home />}
          </Route>
          <Route exact path="/login">
            {user && <Redirect to="/" />}
            {!user && <Login />}
          </Route>
          <Route exact path="/signup">
            {user && <Redirect to="/" />}
            {!user && <SignUp />}
          </Route>
          <Route exact path="/projects">
            {!user && <Redirect to="/" />}
            {user && <Projects />}
          </Route>
          <Route exact path="/projects/:id">
            {!user && <Redirect to="/" />}
            {user && <SingleProject />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
