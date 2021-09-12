import React, { useEffect, useState } from "react";

import db, { auth, provider } from "./firebase";

function Header() {
  const [users, setUser] = useState("abc");
  const [logInfo, setLogInfo] = useState(false);
  const [loadData, setLoadData] = useState(false);

  useEffect(() => {
    db.collection("users")
      .doc(
        !sessionStorage.getItem("user") ? users : sessionStorage.getItem("user")
      )
      .onSnapshot((result) => {
        const data = result.data()?.logInfo;
        if (sessionStorage.getItem("refreshToken") === data) {
          setLoadData(true);
        } else {
          console.log("not now");
        }
      });
  }, [users]);

  const login = () => {
    auth.setPersistence("session").then(() => {
      auth.signInWithPopup(provider).then((result) => {
        let data = result.user;

        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("user", data.uid);
        sessionStorage.setItem("name", data.displayName);
        sessionStorage.setItem("email", data.email);
        setUser(sessionStorage.getItem("user"));

        const info = db.collection("users").doc(data.uid);
        info.get().then((doc) => {
          if (doc.exists) {
            const sessionToken = sessionStorage.getItem("refreshToken");
            if (sessionToken === doc.data().logInfo) {
              console.log("you are good to go");
            } else {
              setLogInfo(true);
            }
          } else {
            info.set({
              name: data.displayName,
              email: data.email,
              logInfo: data.refreshToken,
            });
          }
        });
      });
    });
  };
  const setUserLogin = () => {
    db.collection("users")
      .doc(sessionStorage.getItem("user"))
      .update({
        name: sessionStorage.getItem("name"),
        email: sessionStorage.getItem("email"),
        logInfo: sessionStorage.getItem("refreshToken"),
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <button onClick={login}>Log in</button>
      {logInfo && !loadData && (
        <button onClick={setUserLogin}>
          You are logged in using the same email ID on another
          tab/browser/device. Do you wish to logout from all others and continue
          on this tab?
        </button>
      )}
      {loadData && (
        <>
          <p>Current User Name: {sessionStorage.getItem("name")}</p>
          <p>Current User: {sessionStorage.getItem("email")}</p>
          <p>you are logged in</p>
        </>
      )}
    </div>
  );
}

export default Header;
