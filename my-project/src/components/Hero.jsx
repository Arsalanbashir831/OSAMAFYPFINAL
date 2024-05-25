import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Cricket World</h1>
        <p className="text-lg md:text-2xl mb-8">Your ultimate destination for live scores, match updates, and cricket news.</p>
        <button 
          onClick={() => navigate('/matches')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          View Live Matches
        </button>
      </div>
    </div>
  );
};

export default Hero;
