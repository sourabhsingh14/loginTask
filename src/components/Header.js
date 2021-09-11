import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import db, { auth, provider } from "./firebase";

function Header() {
  const [users, setUser] = useState(null);
  const [logInfo, setLogInfo] = useState();
  const [loadData, setLoadData] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dataLocalStorage, setDataLocalStorage] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      auth.currentUser && console.log("ac");
    });
    setUser({
      ...users,
      name: sessionStorage.getItem("userName"),
      email: sessionStorage.getItem("userEmail"),
    });

    setDataLocalStorage({
      dataLocalStorage: localStorage.getItem("refreshToken"),
    });
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(users?.uid)
      .get()
      .then((result) => {
        // console.log(result.data());
        const data = result.data()?.logInfo;
        setUserData({ refreshToken: data });
      });
  }, [loadData]);

  // TODO: Work here
  useEffect(() => {
    if (dataLocalStorage === userData?.refreshToken) {
      console.log("We are on the right way");
    } else {
      console.log("something went wrong");
    }
  }, [userData?.refreshToken]);

  const login = () => {
    auth.setPersistence("session").then(() => {
      auth.signInWithPopup(provider).then((result) => {
        let data = result.user;
        sessionStorage.setItem("userName", data.displayName);
        sessionStorage.setItem("userEmail", data.email);
        localStorage.setItem("refreshToken", data.refreshToken);
        setUser({
          ...users,
          name: data.displayName,
          email: data.email,
          uid: data.uid,
        });
        setLoadData(true);
        // console.log(data);
        const info = db.collection("users").doc(data.uid);
        info.get().then((doc) => {
          if (doc.exists) {
            console.log(doc.data().logInfo);
            setLogInfo(doc.data().logInfo);
            !logInfo && info.set({ logInfo: data.refreshToken });
          } else {
            info.set({ logInfo: data.refreshToken });
          }
        });
      });
    });
  };

  // const logout = () => {
  //   auth.signOut().then(() => {
  //     setLogInfo(false);
  //     info.update({ logInfo: false });
  //   });
  //   console.log(users.uid);
  //   const info = db.collection("users").doc(users.uid);

  //   auth
  //     .setPersistence("session")
  //     .then(() => auth.signInWithPopup(provider))
  //     .then(info.update({ logInfo: true }));
  // };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <p>Current User Name: {users?.name}</p>
      <p>Current User: {users?.email}</p>
      <button onClick={login}>Log in</button>
      {/* {logInfo && <button onClick={logout}>login logout of other</button>} */}
    </div>
  );
}

export default Header;
