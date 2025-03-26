import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home';
import Contact from './pages/Contact';
import Getstarted from './pages/Getstarted';
import About from './pages/About';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import GenerateResume from './ResumeGeneration/GenerateResume'

{/* to protect the routes from directly access to unAuthenticated person */}
import ProtectedRoutes from './Auth/ProtectedRoutes'

import {auth} from './Auth/firebase';

const App = () =>{

  const [user,setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/GetStarted' element={<Getstarted/>}/>
      <Route path='/GenerateResume' element={<GenerateResume/>}/>
      <Route path='/Contact' element={<Contact/>}/>
      <Route path='/About' element={<About/>}/>
      <Route path='/SignIn' element={user ? <Navigate/>:<SignIn/>}/>
      <Route path='/SignUp' element={<SignUp/>}/>
    </Routes>
    <ToastContainer />
    </BrowserRouter>
    </>
  )
}

export default App
