import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCKCDBTr5k2BH6n6B8kwA-UjkBh1aaUXHA",
  authDomain: "logintask-e0b2b.firebaseapp.com",
  projectId: "logintask-e0b2b",
  storageBucket: "logintask-e0b2b.appspot.com",
  messagingSenderId: "188750000060",
  appId: "1:188750000060:web:40c7444e4187b7d042c5b9",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };

export default db;
