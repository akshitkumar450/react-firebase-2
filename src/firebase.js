import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl1f8Udf4dRoVDzlSwWpcz7lyVN_phnWI",
  authDomain: "todo-app-cp-ee4db.firebaseapp.com",
  projectId: "todo-app-cp-ee4db",
  storageBucket: "todo-app-cp-ee4db.appspot.com",
  messagingSenderId: "195043355054",
  appId: "1:195043355054:web:5962f449a9297c8356003f",
  measurementId: "G-TD8BHVYR72",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
export { auth, db, storage };
