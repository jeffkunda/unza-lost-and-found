import React, { useState } from 'react';
import axios from 'axios';

const ReplyForm = ({ onClose, recipient }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError('Message cannot be empty.');
      return;
    }

    if (!recipient || recipient.trim() === '') {
      setError('Recipient (studentTag) is missing.');
      return;
    }

    setSending(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/replies', {
        message: trimmedMessage,
        studentTag: recipient.trim()
      });
      onClose();
    } catch (err) {
      setError('Failed to send message.');
      console.error('Reply send error:', err);
    }

    setSending(false);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Reply to: {recipient || 'All'}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSend}>
          <label>Message:</label><br />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            required
            style={{ width: '100%' }}
          /><br /><br />
          <button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: '10px' }} disabled={sending}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 0 10px rgba(0,0,0,0.25)'
};

export default ReplyForm;
