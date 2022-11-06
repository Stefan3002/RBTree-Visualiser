import React from 'react';
import './App.css';
import {Route, Routes } from 'react-router-dom';
import Navigation from "./components/navigation/navigation";
import HomePage from "./components/home-page/homePage";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Navigation />}>
            <Route index element={<HomePage/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
