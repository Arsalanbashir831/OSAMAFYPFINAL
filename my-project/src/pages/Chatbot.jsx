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
      // Send message to Google Gemini API
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBwC1h6sQ2BDpyyN92GJl5eMrkrwb0KNaI',
        {
          contents: [
            {
              parts: [
                { text: input }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    console.log(response.data.candidates[0].content.parts[0].text);
      // Update chat history with bot response
      const botResponse = response.data.candidates[0].content.parts[0].text;
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
  }
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
