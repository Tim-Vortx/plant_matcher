// src/PlantMatcherChat.js

import React, { useState } from 'react';
import axios from 'axios';
import './PlantMatcherChat.css';

const PlantMatcherChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // Environment variable for the API key
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    // Function to generate the prompt with the user's input
    const generatePrompt = (userInput) => {
        return `
        You are a plant-matching assistant for an e-commerce plant store. 
        Your role is to help users find the perfect plant based on their preferences for light, maintenance, size, and pet safety.
        - Ask clarifying questions if needed (e.g., light requirements, pet-friendly, maintenance level).
        - Recommend a specific plant or list a few suitable options.
        - Provide plant care instructions if the user requests them.

        User Input: "${userInput}"
        `;
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to chat
        const userMessage = { sender: 'User', text: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            // Send request to OpenAI API
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',  // Using GPT-4 model
                    messages: [
                        { role: 'system', content: generatePrompt(input) },
                        { role: 'user', content: input }
                    ],
                    max_tokens: 150
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`
                    }
                }
            );

            // Add bot's response to chat
            const botMessage = {
                sender: 'Plant Matcher',
                text: response.data.choices[0].message.content
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                sender: 'Plant Matcher',
                text: 'Sorry, something went wrong. Please try again later.'
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    return (
        <div className="chat-container">
            <h2>Ask Our Plant Matcher!</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'User' ? 'user' : 'bot'}`}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default PlantMatcherChat;
