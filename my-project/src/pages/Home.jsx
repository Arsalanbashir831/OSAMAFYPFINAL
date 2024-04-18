import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spin, Alert, Card } from 'antd'; // Using Ant Design Card
import { apikey } from '../utils';


const Home = () => {
  const [matchDetails, setMatchDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="p-4 space-y-4">
      {matchDetails.map(data => (
        <Card
          key={data.event_key}
          hoverable
          onClick={() => navigate('/leagueDetails', { state: { matchDetails: data } })}
          className="transition duration-300 ease-in-out transform hover:scale-105"
          cover={<img alt="Home Team Logo" src={data.event_home_team_logo} style={{ height: 150,width:150, objectFit: 'cover' }} />}
        >
          <Card.Meta
            avatar={<img src={data.event_away_team_logo} alt="Away Team Logo" style={{ width: 40, width:40 ,borderRadius: '50%' }} />}
            title={`${data.event_home_team} vs ${data.event_away_team}`}
            description={
              <div>
                <p>Date: {data.event_date_start}</p>
                <p>Time: {data.event_time}</p>
                <p>League: {data.league_name}</p>
                <p>Round: {data.league_round}</p>
                <p>Status: {data.event_status} - {data.event_status_info}</p>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );
};

export default Home;
