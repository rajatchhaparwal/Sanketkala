import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Contact from './pages/Contact';
const App = () =>{
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='Contact' element={<Contact/>}/>
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
