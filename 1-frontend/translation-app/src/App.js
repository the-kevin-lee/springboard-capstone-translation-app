import React from "react";
import Main from "./pages/Main";
import Authenticate from "./pages/Authenticate";
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
          <Route path='/authenticate' element = {<Authenticate />} />
          <Route path='/translations' element = {<Translations/>} />
          <Route path='*' element = {<Navigate to="/" />} />
         
        </Routes>
        
      </Router>
    
    </>
  );
}

export default App;
