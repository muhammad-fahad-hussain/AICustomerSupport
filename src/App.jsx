import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Add user message to the chat
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyClGZT29-iLZS-MBiDtcPGMhZu2dX4Xz2w",
        method: "post",
        data: { "contents": [{ "parts": [{ "text": input }] }] },
      });

      const content = response.data.candidates[0]?.content?.parts[0]?.text || 'No content generated';
      const formattedContent = formatContent(content);

      // Add response message to the chat
      setMessages([...messages, { text: formattedContent, sender: 'bot' }]);
    } catch (error) {
      console.error("Error fetching content", error);
      setMessages([...messages, { text: 'Failed to generate content', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the content as plain text
  const formatContent = (content) => {
    return content
      .replace(/\n\n+/g, '\n\n')  // Normalize multiple newlines to a single newline
      .trim();  // Remove leading and trailing whitespace
  };

  return (
    <div className="chat-container">
      <h1>Chat Interface</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <div className="message bot"><p>Generating response...</p></div>}
      </div>
      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message here"
        ></textarea>
        <button onClick={handleSend} disabled={loading} style={{background:'red'}}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
