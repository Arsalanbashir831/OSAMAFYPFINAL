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
  };

  const renderMessageText = (text) => {
    const parts = text.split(/(\*\*|[*])/); // Split the text by bold markers (** or *)
    return parts.map((part, index) => {
      if (part === '**' || part === '*') return null;
      const prevPart = parts[index - 1];
      if (prevPart === '**') {
        return <b key={index}>{part}</b>;
      } else if (prevPart === '*') {
        return <i key={index}>{part}</i>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-purple-900 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl w-full mx-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <h1 className="text-2xl text-white font-bold text-center">Chatbot Assistant</h1>
        </div>
        <div className="h-96 mb-4 overflow-auto p-4 bg-gray-100 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 mb-2 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block rounded px-3 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {renderMessageText(message.text)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex p-4 bg-white rounded-b-lg">
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
    </div>
  );
};

export default Chatbot;
