import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        socket.on("connect", () => {
            setUserId(socket.id);
        });

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = { text: message, sender: userId };
            socket.emit("sendMessage", msgData);
            setMessage("");
        }
    };

    // ✅ Function to handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <h1>Real-Time Chat</h1>
            <div className="messages">
                {messages.map((msg, index) => (
                    <p
                        key={index}
                        className={`message ${msg.sender === userId ? "self" : "other"}`}
                    >
                        {msg.text}
                    </p>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}  // ✅ Detect Enter key press
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;
