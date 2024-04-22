import React, { useState } from 'react';
import { Input, Button } from 'antd';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Update chat history with user message
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Send message to chatbot API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful cricket assistant.' },
            { role: 'user', content: input }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sk-proj-3nLLNkVntHbtYCjZsYG5T3BlbkFJtxuSmgM1ZT1zuZ43wCy9' // Replace with your OpenAI API key
          }
        }
      );

      // Update chat history with bot response
      const botResponse = response.data.choices[0].message.content;
      newMessages.push({ text: botResponse, sender: 'bot' });
      setMessages(newMessages);
    } catch (error) {
      // Handle API request error
      console.error('Failed to fetch response:', error);
      newMessages.push({
        text: 'Failed to fetch response. Please try again later.',
        sender: 'bot'
      });
      setMessages(newMessages);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-4 bg-white shadow-lg rounded">
      <div className="h-96 mb-4 overflow-auto p-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block rounded px-3 py-2 ${
                message.sender === 'user' ? 'bg-blue-200 text-white' : 'bg-gray-200'
              }`}
            >
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
