import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Badge, Typography, Tabs, Divider, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { apikey } from '../utils';
import { useLocation } from 'react-router-dom';


const { Title, Text } = Typography;
const { TabPane } = Tabs;

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const listItemVariant = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};



const LiveMatchPage = () => {
  function getRandomOvers(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const location = useLocation()
  const { matchDetails } = location.state
  const [stats, setStats] = useState([]);
  useEffect(() => {
    // console.log(matchDetails);
    // console.log(matchDetails.scorecard[matchDetails.event_home_team + " 1 INN"]);
    matchDetails.scorecard[matchDetails.event_home_team + " 1 INN"].forEach((player) => {

      const data = {
        Player: player.player || "Unknown", // If player's name is null, default to "Unknown"
        balls_faced: player.R || '0',              // If runs (R) are null, default to 0
        // player.B || '0',              // If balls faced (B) are null, default to 0
        // player['4s'] || '0',          // If number of 4s is null, default to 0
        // player['6s'] || '0',          // If number of 6s is null, default to 0
        // player.SR || '0',             // If strike rate (SR) is null, default to 0
        Opposition: matchDetails.event_away_team || "Unknown Team", // If away team is null, default to "Unknown Team"},
        overs: getRandomOvers(5, 20),
      };
      console.log(data)
      fetch('http://127.0.0.1:4000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(info => {
          // console.log(info);
          // Display the prediction result using Bootstrap's alert for aesthetics
          setStats(prev => [
            ...prev,
            {
              player: player.player || "Unknown", // If player's name is null, default to "Unknown"
              R: player.R || '0',              // If runs (R) are null, default to 0
              B: player.B || '0',              // If balls faced (B) are null, default to 0
              '4s':  player['4s'] || '0',          // If number of 4s is null, default to 0
              '6s': player['6s'] || '0',          // If number of 6s is null, default to 0
              'SR':  player.SR || '0',             // If strike rate (SR) is null, default to 0
              opposition: matchDetails.event_away_team || "Unknown Team", // If away team is null, default to "Unknown Team"
              predicted_runs: info.predicted_runs || "0",
              message: info.message || "Unknown"
            }
          ]);
        })
        .catch((error) => {
          console.error('Error:', error);
          // Optionally handle errors by displaying them in a similar styled alert

          // const predictionResult = document.getElementById('predictionResult');
          // predictionResult.innerHTML = `<div class="alert alert-danger" role="alert">Error: Could not retrieve prediction.</div>`;
          // predictionResult.style.display = 'block';
        });


    });

    // console.log(stats);

  }, []);


  function getPrediction(data) {
    fetch('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        // Display the prediction result using Bootstrap's alert for aesthetics

      })
      .catch((error) => {
        console.error('Error:', error);
        // Optionally handle errors by displaying them in a similar styled alert
        const predictionResult = document.getElementById('predictionResult');
        predictionResult.innerHTML = `<div class="alert alert-danger" role="alert">Error: Could not retrieve prediction.</div>`;
        predictionResult.style.display = 'block';
      });
  }

  // Assuming scorecard is an object where each key is an innings
  const renderScoreCard = (scorecard) => {
    console.log(stats);
    const inningsNames = Object.keys(scorecard || {});
    return inningsNames.map(inningsName => (
      <List
        key={inningsName}
        header={<div>{inningsName}</div>}
        itemLayout="horizontal"
        dataSource={stats}
        renderItem={(item, index) => (

          <List.Item>
            <List.Item.Meta
              title={<span>{item.player}</span>}
              description={
                <>
                  <span>{item.status}</span>
                  <div className="flex justify-between items-center w-full">
                    <span>R: {item.R}</span>
                    <span>B: {item.B}</span>
                    <span>4s: {item['4s']}</span>
                    <span>6s: {item['6s']}</span>
                    <span>SR: {item.SR}</span>
                    <span>Predicted Runs: {item.predicted_runs}</span>
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    ));
  };

  const renderComments = (comments) => {
    const phases = Object.keys(comments || {});
    return phases.map(phase => (
      <List
        key={phase}
        header={<div>{phase}</div>}
        dataSource={comments[phase]}
        renderItem={item => (
          <List.Item>
            <div className="flex justify-between w-full">
              <span>{item.overs}.{item.balls}</span>
              <span>{item.post}</span>
            </div>
          </List.Item>
        )}
      />
    ));
  };

  const renderPlayerList = (lineup) => {
    if (!lineup || !lineup.starting_lineups) {
      return null;
    }

    return (
      <List
        dataSource={lineup.starting_lineups}
        renderItem={player => (
          <List.Item>
            {player.player}
          </List.Item>
        )}
      />
    );
  };

  if (!matchDetails) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariant}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Card className="mb-4 shadow-lg">
        <div className="text-center">
          <Title level={3}>{matchDetails?.league_name} - {matchDetails?.league_season}</Title>
          <Text>{matchDetails?.event_stadium}</Text>
          <Text block>{matchDetails?.event_date_start} at {matchDetails?.event_time}</Text>
          <Text block className="mb-2">{matchDetails?.event_status_info}</Text>
          <Divider />
          <div className="flex justify-center items-center">
            <Avatar size={64} src={matchDetails?.event_home_team_logo} icon={<UserOutlined />} />
            <Text className="mx-4 text-3xl">{matchDetails?.event_home_final_result}</Text>
            <Text>vs</Text>
            <Text className="mx-4 text-3xl">{matchDetails?.event_away_final_result || 'TBD'}</Text>
            <Avatar size={64} src={matchDetails?.event_away_team_logo} icon={<UserOutlined />} />
          </div>
          <Divider />
          <Badge status={matchDetails?.event_live ? 'processing' : 'default'} text={matchDetails?.event_status} />
        </div>
      </Card>

      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Lineups" key="1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text strong>{matchDetails.event_home_team}</Text>
              {renderPlayerList(matchDetails.lineups.home_team)}
            </div>
            <div>
              <Text strong>{matchDetails.event_away_team}</Text>
              {renderPlayerList(matchDetails.lineups.away_team)}
            </div>
          </div>
        </TabPane>
        <TabPane tab="Commentary" key="2">
          {renderComments(matchDetails.comments)}
        </TabPane>
        <TabPane tab="Scorecard" key="3">
          {renderScoreCard(matchDetails.scorecard)}
        </TabPane>
      </Tabs>
    </motion.div>
  );
};

export default LiveMatchPage;
