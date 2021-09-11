import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import db, { auth, provider } from "./firebase";

function Header() {
  const [users, setUser] = useState(null);
  const [logInfo, setLogInfo] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      auth.currentUser && console.log("ac");
    });
  }, []);
  const login = () => {
    auth.setPersistence("session").then(() => {
      auth.signInWithPopup(provider).then((result) => {
        let data = result.user;
        console.log(data.uid);
        // const info = db.collection("users").doc(data.uid);
        // info.get().then((doc) => {
        //   if (doc.exists) {
        //     console.log(doc.data().logInfo);
        //     setLogInfo(doc.data().logInfo);
        //     !logInfo && info.set({ logInfo: true });
        //   } else {
        //     info.set({ logInfo: true });
        //   }
        // });
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
    <div>
      <p>Current User: {users?.email}</p>
      <button onClick={login}>Log in</button>;
      {/* {logInfo && <button onClick={logout}>login logout of other</button>} */}
    </div>
  );
}

export default Header;
