import React, { useState } from 'react';
import axios from 'axios';

const PostItemForm = ({ token, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [locationFound, setLocationFound] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !locationFound || !contactInfo) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('locationFound', locationFound);
      formData.append('contactInfo', contactInfo);
      if (image) formData.append('image', image);

      await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setLocationFound('');
      setContactInfo('');
      setImage(null);
      setError('');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post item');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>What did you find? *</label><br />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Where did you find it? *</label><br />
        <input
          type="text"
          value={locationFound}
          onChange={e => setLocationFound(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Phone number *</label><br />
        <input
          type="text"
          value={contactInfo}
          onChange={e => setContactInfo(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Image</label><br />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
      </div>

      <button type="submit">Post Item</button>
    </form>
  );
};

export default PostItemForm;
