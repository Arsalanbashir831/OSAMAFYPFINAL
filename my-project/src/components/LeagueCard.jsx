import React from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';

const LeagueCard = ({ league }) => {
  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
      className="m-4"
    >
      <Card
        hoverable
        className="rounded-lg border border-gray-300"
        style={{ width: 300, height: 200 }} // Fixed size for consistency
        bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        <h3 className="text-lg font-bold text-blue-600">{league.league_name}</h3>
        <p className="text-gray-700">{league.league_year}</p>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          #{league.league_key}
        </span>
      </Card>
    </motion.div>
  );
};

export default LeagueCard;
