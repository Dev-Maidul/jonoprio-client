import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";


import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { app } from '../Firebase/firebase.config';


export const AuthContext = createContext();


const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Create User function
  const CreateUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in user Function with email and password
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    return updateProfile(auth.currentUser, updatedUser);
  };
  
  // Signin with google functionality

  const googleSignIn = () => {
    
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      
  };
  // Update user profile
  const updateUserProfile=(name,photo)=>{
    updateProfile(auth.currentUser, {
      displayName: name, photoURL: photo
    }).then(() => {
      alert("Profile Update Successfully");
    }).catch((error) => {
    console.log(error);
    });
  }
  // Reset user password
  const resetUserPassword=(email)=>{
   return sendPasswordResetEmail(auth,email)
    .then((result)=>{
      console.log(result)
      alert("A password reset link has been sent to your email")
      
    }).catch((error)=>{
      console.log(error);
    })
  }

  const logOut = () => {
    return signOut(auth);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);
      setLoading(false);
    });


    return () => {
      unsubscribe();
    };
  }, []);


  const authData = {
    user,
    setUser,
    CreateUser,
    logOut,
    signIn,
    loading,
    setLoading,
    updateUser,
    googleSignIn,
    updateUserProfile,
    resetUserPassword
  };


  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
