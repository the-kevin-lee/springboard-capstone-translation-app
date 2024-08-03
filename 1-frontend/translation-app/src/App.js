import React from "react";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Translations from "./pages/Translation";

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
      
          <Route path='/translations' element = {<Translations/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element = {<Navigate to="/" />} />
         
        </Routes>
        
      </Router>
    
    </>
  );
}

export default App;
