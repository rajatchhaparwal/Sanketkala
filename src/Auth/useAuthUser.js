import { useEffect, useState } from "react";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

{/* for user sign in*/}

const useAuthUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};

export default useAuthUser;