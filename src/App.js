import './css/App.css';
import { Routes, Route } from 'react-router-dom'
import React from 'react';
import Login from "./Login";
import Signup from './Signup'
import Homepage from './Homepage';
import Settings from './Settings';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;

