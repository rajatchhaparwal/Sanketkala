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
import GenerateResume from './ResumeGeneration/GenerateResume';
import InterviewPage from './pages/InterviewPage';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/getStarted' element={<Getstarted/>}/>
          <Route path='/generateResume' element={<GenerateResume/>}/>
          <Route path='/interview' element={<InterviewPage/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/signIn' element={<SignIn/>}/>
          <Route path='/signUp' element={<SignUp/>}/>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App;
