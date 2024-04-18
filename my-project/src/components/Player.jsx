import React, { useEffect, useState } from 'react';
import { Card, Tag, Avatar, Typography,Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Registering the components necessary for Bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Title: AntTitle, Paragraph } = Typography;

const Player = () => {
    const [playerResponse, setPlayers] = useState(null);
    const location = useLocation();
    const { id } = location.state || {}; // Make sure to have a fallback if state is undefined

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            try {
                const response = await axios.get(`https://api.cricapi.com/v1/players_info?apikey=a2d5f255-eeb1-41c3-b8d9-c526e997397e&id=${id}`);
                setPlayers(response.data);
            } catch (error) {
                console.error('Error fetching player info:', error);
            }
        };
        fetchPlayerInfo();
    }, [id]); // id should be a dependency here

    // Filter stats for valid numerical values only when playerResponse is available
    const validStats = playerResponse ? playerResponse.data.stats.filter(stat => stat.value !== '-' && !isNaN(stat.value)) : [];

    const chartData = {
        labels: validStats.map(stat => `${stat.fn} ${stat.matchtype} ${stat.stat}`),
        datasets: [{
            label: `${playerResponse?.data.name}'s Stats`,
            data: validStats.map(stat => Number(stat.value)),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        scales: {
            y: { beginAtZero: true }
        },
        plugins: { legend: { display: false } }
    };

    if (!playerResponse) {
        return <Spin size="large" />;
    }

    return (
        <Card
            bordered={true}
            style={{ width: 600, margin: '20px auto' }}
            hoverable
            cover={<img alt="Player" src={playerResponse.data.playerImg || "https://h.cricapi.com/img/icon512.png"} />}
        >
            <AntTitle level={2}>{playerResponse.data.name}</AntTitle>
            <Avatar size={64} icon={<UserOutlined />} src={playerResponse.data.playerImg} />
            <Tag color="blue">{playerResponse.data.country}</Tag>
            <Paragraph><strong>Role:</strong> {playerResponse.data.role}</Paragraph>
            <Paragraph><strong>Batting Style:</strong> {playerResponse.data.battingStyle}</Paragraph>
            <Paragraph><strong>Bowling Style:</strong> {playerResponse.data.bowlingStyle}</Paragraph>
            <Paragraph><strong>Date of Birth:</strong> {new Date(playerResponse.data.dateOfBirth).toLocaleDateString()}</Paragraph>
            <Paragraph><strong>Place of Birth:</strong> {playerResponse.data.placeOfBirth || 'Unknown'}</Paragraph>
            {validStats.length > 0 && <Bar data={chartData} options={chartOptions} />}
        </Card>
    );
};

export default Player;
