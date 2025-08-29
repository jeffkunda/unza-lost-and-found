import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const ClaimForm = ({ token, item, onClose, onSuccess }) => {
  const [detail, setDetail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/claims',
        {
          itemId: item._id,
          detail,
          studentId,
          phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim');
    }

    setSubmitting(false);
  };

  return (
    <div className="claim-overlay">
      <div className="claim-modal">
        <h3>Claim: {item.title}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Describe the item's unique details:</label>
          <textarea
            value={detail}
            onChange={e => setDetail(e.target.value)}
            placeholder="Mention specific marks, colors, engravings, or other details that confirm it's yours. If the item is an ID, simply state 'This is my ID'."
            required
            rows="3"
          />

          <label>Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            required
          />

          <label>Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Claim'}
          </button>{" "}
          <button type="log-ou" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
