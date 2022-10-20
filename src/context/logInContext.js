import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateEmail,
} from "firebase/auth";

import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  limitToLast,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const LogInContext = createContext();

export const LogInContextProvider = (props) => {
  // const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const [cart, setCart] = useState([]);

  // REGISTER NEW USER
  const registerNewUser = (email, password, username) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
        setUser(user);
        // console.log(auth);
        // ...
        updateProfile(auth.currentUser, {
          displayName: username,
          // photoURL: "https://example.com/jane-q-user/profile.jpg",
        });
        // .then(() => {
        //   // Profile updated!
        //   // ...
        // })
        // .catch((error) => {
        //   // An error occurred
        //   // ...
        // });
      })
      .catch((error) => {
        const errorCode = error.code;
        setErrorMessage(error.message);
        console.log(error);
      });
  };

  // LOG IN
  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setUser(user);
        return true;
        //can add navigate functiin here and move context provider inside router
        // rewrite this to async function
        // ...
      })
      .catch((error) => {
        setErrorMessage(error.message);
        // console.log(error);
        return false;
      });
  };

  // LOG OUT
  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        // console.log(auth);
        // console.log(user);
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  // CHECK IF USER IS LOGGED IN
  const checkIfUserIsLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...
        setUser(user);
        // console.log(user);
        // console.log(auth);
      } else {
        setUser(null);
        // User is signed out
        // ...
      }
    });
  };

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  // UPDATE USER EMAIL
  const updateUserEmail = (newEmail) => {
    updateEmail(auth.currentUser, newEmail)
      .then(() => {
        // Email updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };
  // UPDATE DISPLAY NAME
  const updateUserDisplayName = (newDisplayName) => {
    updateProfile(auth.currentUser, {
      displayName: newDisplayName,
    })
      .then(() => {
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };

  // ADD TO CART DATABASE

  // const addToCart = async (product) => {
  //   const cartObj = {
  //     product: product,
  //     date: new Date(),
  //     user: user.email,
  //   };
  //   try {
  //     const docRef = await addDoc(collection(db, "cart"), cartObj);
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  // V2

  const addToCart = async (product, userId, productId) => {
    console.log(product);
    console.log(userId);
    console.log(productId);
    const newProductId = productId.toString();
    await setDoc(doc(db, "cart", userId, "productId", newProductId), {
      product: product,
      date: new Date(),
    });
    console.log("add-to-cart");
  };

  // READ CART DATABASE
  const readCart = async () => {
    const q = query(
      collection(db, "cart", user.email, "productId"),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const cartArray = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id);
      // console.log(doc.data);
      cartArray.push(doc.data());
    });
    console.log(cartArray);
    setCart(cartArray);
    console.log(cart);
  };

  useEffect(() => {
    user && readCart();
  }, [user]);

  // DELETE FROM CART

  const removeCartItem = async (userId, productId) => {
    const newProductId = productId.toString();
    await deleteDoc(doc(db, "cart", userId, "productId", newProductId));
  };

  return (
    <LogInContext.Provider
      value={{
        logIn,
        registerNewUser,
        user,
        logOut,
        errorMessage,
        updateUserEmail,
        updateUserDisplayName,
        addToCart,
        readCart,
        cart,
        removeCartItem,
      }}
    >
      {props.children}
    </LogInContext.Provider>
  );
};
