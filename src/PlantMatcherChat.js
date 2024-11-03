// src/PlantMatcherChat.js

import React, { useState } from 'react';
import axios from 'axios';
import './PlantMatcherChat.css';  // Optional: Create this CSS file for styling

const PlantMatcherChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;  // Fetch API key from environment variables

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to the chat
        const userMessage = { sender: 'User', text: input };
        setMessages([...messages, userMessage]);
        setInput('');  // Clear input

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/completions',
                {
                    model: 'gpt-4',  // Specify the GPT model you are using
                    prompt: generatePrompt(input),
                    max_tokens: 100
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`
                    }
                }
            );

            // Add the bot's response to the chat
            const botMessage = {
                sender: 'Plant Matcher',
                text: response.data.choices[0].text.trim()
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

    // Function to generate the prompt for the GPT model
    const generatePrompt = (userInput) => {
        return `A user is looking for a plant that matches specific preferences. The user said: "${userInput}". Provide a recommendation with care instructions.`;
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
