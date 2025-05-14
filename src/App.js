import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Example from '../src/pages/example';
import Start from './pages/Start';
import Main from './pages/Main';
import Review from './pages/Review';
import ReviewDetail from './pages/Review/detail';
import ReviewWrite from './pages/Review/write';
import Rank from './pages/Rank';
import Carpool from './pages/Carpool';
import CarpoolDetail from './pages/Carpool/detail';
import CarpoolWrite from './pages/Carpool/write';
import Course from './pages/Course';
import My from './pages/My';
import Heart from './pages/Heart';
import Map from './components/map';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Example />} />
        <Route path="/start" element={<Start />} />
        <Route path="/main" element={<Main />} />
        <Route path="/review" element={<Review />} />
        <Route path="/rdetail" element={<ReviewDetail />} />
        <Route path="/rwrite" element={<ReviewWrite />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/carpool" element={<Carpool />} />
        <Route path="/cdetail" element={<CarpoolDetail />} />
        <Route path="/cwrite" element={<CarpoolWrite />} />
        <Route path="/course" element={<Course />} />
        <Route path="/my" element={<My />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
