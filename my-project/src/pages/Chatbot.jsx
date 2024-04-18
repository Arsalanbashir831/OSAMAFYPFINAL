import React, { useState } from 'react';
import { Input, Button } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:4000/chatbot', { query: input });
      newMessages.push({ text: response.data.response, sender: 'bot' });
      setMessages(newMessages);
    } catch (error) {
      newMessages.push({ text: 'Failed to fetch response. Please try again later.', sender: 'bot' });
      setMessages(newMessages);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-4 bg-white shadow-lg rounded">
      <div className="h-96 mb-4 overflow-auto p-2">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block rounded px-3 py-2 ${message.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          placeholder="Type your message here..."
          value={input}
          onChange={handleInputChange}
          onPressEnter={handleSubmit}
          className="mr-2 flex-grow"
        />
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
