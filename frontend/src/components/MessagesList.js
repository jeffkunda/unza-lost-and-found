import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessagesList = ({ token, onClose }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/replies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReplies(res.data);
      } catch (err) {
        setError('Failed to fetch replies');
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [token]);

  return (
    <div style={fullscreenContainer}>
      <div style={headerStyle}>
        <h2 style={{ width: '100%', borderBottom: '1px solid #ccc' }}>Messages</h2>
        <button onClick={onClose} style={closeButtonStyle}>Close</button>
      </div>

      {loading && <p>Loading messages...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && replies.length === 0 && <p>No messages found.</p>}

      <ul style={listStyle}>
        {replies.map((reply) => (
          <li key={reply._id} style={messageStyle}>
            <p><strong>Message:</strong> {reply.message}</p>
            <p><small><strong>Addressed to:</strong> {reply.studentTag}</small></p>
            <p><small>{new Date(reply.timestamp).toLocaleString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const fullscreenContainer = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: '97vw',
  backgroundColor: '#f9f9f9',
  padding: '20px',
  overflowY: 'auto',
  zIndex: 999,
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const closeButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#d9534f',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  width: '100%',
  maxWidth: '900px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const messageStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
  padding: '15px 20px',
  boxSizing: 'border-box',
  width: '100%',
  transition: 'box-shadow 0.3s ease',
};

export default MessagesList;
