import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spin, Alert, Card } from 'antd';
import { apikey } from '../utils';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Connection/DB';
import logo from '../assets/logo.png'
import Hero from '../components/Hero';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [navigate]);

  const [matchDetails, setMatchDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`https://apiv2.api-cricket.com/?method=get_livescore&APIkey=${apikey}`)
      .then(response => {
        setMatchDetails(response.data.result);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching match details:", error);
        setError("Failed to fetch match details.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  if (error) return <Alert message="Error" description={error} type="error" showIcon className="w-full" />;

  return (
    <>
    <Hero/>
    <div className="p-4 space-y-4">
      {matchDetails.map(data => (
        <Card
          key={data.event_key}
          hoverable
          onClick={() => navigate('/leagueDetails', { state: { matchDetails: data } })}
          className="transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: '#fff',
          }}
        >
          <div className="flex justify-between items-center p-4 bg-white">
            <img alt="Home Team Logo" src={data.event_home_team_logo || logo} className="h-32 w-32 object-contain" />
            <div className="text-center text-blue-900 text-2xl font-bold">VS</div>
            <img alt="Away Team Logo" src={data.event_away_team_logo || logo} className="h-32 w-32 object-contain" />
          </div>
          <div className="p-4">
            <div className="text-center mb-4">
              <span className="text-white text-xl font-bold">{`${data.event_home_team} vs ${data.event_away_team}`}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-white">
              <p><span className="font-semibold">Date:</span> {data.event_date_start}</p>
              <p><span className="font-semibold">Time:</span> {data.event_time}</p>
              <p><span className="font-semibold">League:</span> {data.league_name}</p>
              <p><span className="font-semibold">Round:</span> {data.league_round}</p>
              <p className="col-span-2"><span className="font-semibold">Status:</span> {data.event_status} - {data.event_status_info}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
    </>
  );
};

export default Home;
