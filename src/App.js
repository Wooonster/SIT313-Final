import './css/App.css';
import { Routes, Route } from 'react-router-dom'
import React from 'react';
import Login from "./Login";
import Signup from './Signup'
import Homepage from './Homepage';
import Settings from './Settings';
import Post from './Post'
import Forget from './Forget'
import Detail from './Detail';
import Plan from './Plan'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forget' element={<Forget />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/post' element={<Post />} />
        <Route path='/detail' element={<Detail />} />
        <Route path='/plan' element={<Plan />} />
      </Routes>
    </div>
  );
}

export default App;

