// src/App.js

import React from 'react';
import './App.css';
import PlantMatcherChat from './PlantMatcherChat';  // Import the chat component

function App() {
    return (
        <div className="App">
            <h1>Welcome to the Plant Matcher</h1>
            <PlantMatcherChat />  {/* Render the chat component */}
        </div>
    );
}

export default App;
