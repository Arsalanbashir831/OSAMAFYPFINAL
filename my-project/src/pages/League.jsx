import React, { useEffect, useState } from 'react';
import LeagueCard from '../components/LeagueCard';
import axios from 'axios';
import { Input } from 'antd';
import { apikey } from '../utils';

const League = () => {
  const [leagues, setLeagues] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const response = await axios.get(`https://apiv2.api-cricket.com/cricket/?method=get_leagues&APIkey=${apikey}`);
        setLeagues(response.data.result);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      }
    };

    fetchLeague();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredLeagues = leagues.filter(league => {
    return league.league_name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
    <div className='bg-blue-900'>

      <div className="px-4 py-5  text-center">
        <Input
          placeholder="Search leagues"
          value={search}
          onChange={handleSearchChange}
          style={{ width: 300 }}
        />
      </div>
      <div className="flex flex-wrap justify-center ">
        {filteredLeagues.map(league => (
          <LeagueCard key={league.league_key} league={league} />
        ))}
      </div>
    </div>
    </>
  );
};

export default League;
