import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllReplies = () => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await axios.get('/api/replies');
        setReplies(res.data);
      } catch (err) {
        console.error('Error fetching replies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Replies</h2>
      {loading ? (
        <p>Loading replies...</p>
      ) : replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {replies.map((reply) => (
            <li key={reply._id} style={replyStyle}>
              <p><strong>Message:</strong> {reply.message}</p>
              {reply.studentTag && <p><strong>To:</strong> {reply.studentTag}</p>}
              <p style={{ fontSize: '0.9em', color: 'gray' }}>
                {new Date(reply.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const replyStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9'
};

export default AllReplies;
