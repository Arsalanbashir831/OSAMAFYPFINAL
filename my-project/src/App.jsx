import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import League from './pages/League';
import Navbar from './components/Navbar';
import LeagueDetails from './pages/LeagueDetails';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlayersList from './pages/PlayerList';
import Player from './components/Player';

const App = () => {
  const location = useLocation();
  const showNavbar = !['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/league' element={<League/>}></Route>
        <Route path='/leagueDetails' element={<LeagueDetails/>}></Route>
        <Route path='/team' element={<PlayersList/>}></Route>
        <Route path='/chatbot' element={<Chatbot/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/player' element={<Player/>}></Route>
      </Routes>
    </>
  );
}

export default App;

// http://127.0.0.1:4000/prediction
