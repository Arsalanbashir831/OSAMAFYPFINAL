import React, { useEffect, useState } from 'react';
import { Card, Spin, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


// Registering the components necessary for Bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Player = () => {
    const [playerResponse, setPlayerResponse] = useState(null);
    const location = useLocation();
    const { id } = location.state || {};

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            try {
                const response = await axios.get(`https://api.cricapi.com/v1/players_info?apikey=a301681d-ac0b-44e7-9b9d-05af37bb343c&id=${id}`);
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

    const columns = [
        {
            title: 'Function',
            dataIndex: 'fn',
            key: 'fn',
        },
        {
            title: 'Match Type',
            dataIndex: 'matchtype',
            key: 'matchtype',
        },
        {
            title: 'Stat',
            dataIndex: 'stat',
            key: 'stat',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center">
                    <img className="w-32 h-32 rounded-full mt-4" alt="Player" src={data?.playerImg || "https://h.cricapi.com/img/icon512.png"} />
                    <h2 className="text-2xl font-bold mt-4">{data?.name}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                        <UserOutlined className="text-xl" />
                        <span className="text-lg">{data?.country}</span>
                    </div>
                    <div className="mt-4">
                        <span className="bg-blue-500 text-white py-1 px-3 rounded">{data?.country}</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                        <p><strong>Role:</strong> {data?.role}</p>
                        <p><strong>Batting Style:</strong> {data?.battingStyle}</p>
                        <p><strong>Bowling Style:</strong> {data?.bowlingStyle}</p>
                    </div>
                    <div>
                        <p><strong>Date of Birth:</strong> {new Date(data?.dateOfBirth).toLocaleDateString()}</p>
                        <p><strong>Place of Birth:</strong> {data?.placeOfBirth || 'Unknown'}</p>
                    </div>
                </div>
                {data?.stats && data?.stats.length > 0 && (
                    <>
                        <div className="mt-6">
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
                        </div>
                        <div className="mt-6">
                            <Table
                                dataSource={data.stats}
                                columns={columns}
                                rowKey={(record) => `${record.fn}-${record.matchtype}-${record.stat}`}
                                pagination={false}
                                className="w-full"
                            />
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default Player;
