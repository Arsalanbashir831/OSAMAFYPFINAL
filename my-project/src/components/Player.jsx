import React, { useEffect, useState } from 'react';
import { Card, Tag, Avatar, Typography, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Registering the components necessary for Bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Title: AntTitle, Paragraph } = Typography;

const Player = () => {
    const [playerResponse, setPlayerResponse] = useState(null);
    const location = useLocation();
    const { id } = location.state || {};

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            try {
                const response = await axios.get(`https://api.cricapi.com/v1/players_info?apikey=a2d5f255-eeb1-41c3-b8d9-c526e997397e&id=${id}`);
                setPlayerResponse(response.data);
            } catch (error) {
                console.error('Error fetching player info:', error);
            }
        };
        fetchPlayerInfo();
    }, [id]);

    if (!playerResponse) {
        return <Spin size="large" />;
    }

    const { data } = playerResponse;

    return (
        <Card
            bordered={true}
            style={{ width: 600, margin: '20px auto' }}
            hoverable
            cover={<img alt="Player" src={data.playerImg || "https://h.cricapi.com/img/icon512.png"} />}
        >
            <AntTitle level={2}>{data.name}</AntTitle>
            <Avatar size={64} icon={<UserOutlined />} src={data.playerImg} />
            <Tag color="blue">{data.country}</Tag>
            <Paragraph><strong>Role:</strong> {data.role}</Paragraph>
            <Paragraph><strong>Batting Style:</strong> {data.battingStyle}</Paragraph>
            <Paragraph><strong>Bowling Style:</strong> {data.bowlingStyle}</Paragraph>
            <Paragraph><strong>Date of Birth:</strong> {new Date(data.dateOfBirth).toLocaleDateString()}</Paragraph>
            <Paragraph><strong>Place of Birth:</strong> {data.placeOfBirth || 'Unknown'}</Paragraph>
            
            {data.stats && data.stats.length > 0 && (
                <Bar
                    data={{
                        labels: data.stats.map(stat => `${stat.fn} ${stat.matchtype} ${stat.stat}`),
                        datasets: [{
                            label: `${data.name}'s Stats`,
                            data: data.stats.map(stat => Number(stat.value)),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        }],
                    }}
                    options={{
                        scales: {
                            y: { beginAtZero: true }
                        },
                        plugins: { legend: { display: false } }
                    }}
                />
            )}
        </Card>
    );
};

export default Player;
