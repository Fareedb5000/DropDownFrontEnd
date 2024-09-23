import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SlidingImagePage from './components/Mainpage';
import RoadPage from './components/ZoomPage';

import './App.css';

const App =()=> {
  return (
    <>
      <Routes>
        <Route path="/" element={<SlidingImagePage />} />
        <Route path="/RoadPage" element={<RoadPage />} />
      </Routes>
    </>
  );
}

export default App;
