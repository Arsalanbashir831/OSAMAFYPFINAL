// components/PlayersList.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Spin, Alert, Input,Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true);
    axios.get(`https://api.cricapi.com/v1/players?apikey=a2d5f255-eeb1-41c3-b8d9-c526e997397e&offset=${offset}&search=${search}`)
      .then(response => {
        if (Array.isArray(response.data.data)) {
          setPlayers(response.data.data);
        } else {
          console.error("Unexpected response structure:", response.data);
          setError("Unexpected response structure.");
          setPlayers([]);
        }
      })
      .catch(err => {
        console.error("Fetching error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [offset, search]);

  const handleSearch = value => {
    setSearch(value);
    setOffset(0);  
  };

  const handleViewDetails = (player) => {
    navigate('/player',{
      state:{
        id:player.id
      }
    })
    // Here you could set state for a modal or redirect using routing
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'View Details',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      )
    },
  ];

  return (
    <div className="p-4">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Input.Search
          placeholder="Search by name or country"
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />
        {error && <Alert type="error" message={error} />}
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            columns={columns} 
            dataSource={players} 
            rowKey="id" 
            pagination={{
              current: offset / 25 + 1,
              pageSize: 25,
              total: 500, // Adjust based on total data
              onChange: (page, pageSize) => {
                setOffset((page - 1) * pageSize);
              }
            }}
          />
        )}
        <div className="flex justify-between mt-4">
          <Button onClick={() => setOffset(prev => Math.max(0, prev - 25))} disabled={offset === 0}>
            Previous
          </Button>
          <Button onClick={() => setOffset(prev => prev + 25)}>
            Next
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default PlayersList;
