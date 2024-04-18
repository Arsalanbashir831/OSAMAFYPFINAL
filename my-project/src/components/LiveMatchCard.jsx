import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Badge, Typography, Tabs, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { apikey } from '../utils';

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

const LiveMatchPage = ({data}) => {
  const [matchDetails, setMatchDetails] = useState(null);
  
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`https://apiv2.api-cricket.com/?method=get_livescore&APIkey=${apikey}`);
        setMatchDetails(response.data.result[0]);
      } catch (error) {
        console.error("Error fetching match details:", error);
      }
    };
    fetchMatch();
  }, []);

  // Assuming scorecard is an object where each key is an innings
  const renderScoreCard = (scorecard) => {
    const inningsNames = Object.keys(scorecard || {});
    return inningsNames.map(inningsName => (
      <List
        key={inningsName}
        header={<div>{inningsName}</div>}
        itemLayout="horizontal"
        dataSource={scorecard[inningsName]}
        renderItem={item => (
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
          {renderScoreCard(matchDetails?.scorecard)}
        </TabPane>
      </Tabs>

     
    </motion.div>
  );
};

export default LiveMatchPage;
