import React from "react";
import Register from "./pages/Register";
import Main from "./pages/Main";
import Login from "./pages/Login";
import EditUserInfo from "./pages/EditUserInfo";
import DeleteAccount from "./pages/DeleteAccount";

import Dashboard from './pages/Dashboard';
import Translations from "./pages/Translations";

import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import Navigation from "./components/Navigation";



function App() {
  return (
    <>
      <Router>
          <Navigation />



        <Routes>

          {/* vvvvvvvv this is the main SPA */}
          <Route path="/" element={<Main />} />
      
          {/* vvvvvv user related functionality */}
         
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          

          <Route path='/translations' element = {<Translations/>} />
          <Route path="/edit-info" element={<EditUserInfo/>} />
          <Route path="/delete-account" element={<DeleteAccount/>} />
          



          <Route path='*' element = {<Navigate to="/" />} />
         
        </Routes>
        
      </Router>
    
    </>
  );
}

export default App;
