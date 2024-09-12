import React, { useState } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const sendMessage = async () => {
        if (userInput.trim() === '') return;

        const userMessage = { sender: 'user-cb', text: userInput };
        setMessages([...messages, userMessage]);
        setUserInput('');

        try {
            const response = await fetch('http://localhost:8000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userInput }),
            });

            const data = await response.json();
            const botMessage = { sender: 'bot-cb', text: data.answer };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching bot response:', error);
        }
    };

    return (
        <div className="chat-container-cb">
            <div className="chatbox-cb">
                <div className="messages-cb">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-cb ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>
            <input
                type="text"
                className="user-input-cb"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a message..."
            />
            <button className="send-btn-cb" onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;
