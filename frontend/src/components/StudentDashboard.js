import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.js';
import ClaimForm from './ClaimForm.js';
import MessagesList from './MessagesList.js';
import PostItemModal from './PostItemModal.js';
import '../App.css';

const StudentDashboard = ({ logout, token }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [claimingItem, setClaimingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const fetchItems = async (query = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/items';
      if (query) url += `/search?q=${encodeURIComponent(query)}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItems(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch items');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(searchQuery);
  };

  const handlePostSuccess = () => {
    fetchItems();
    setShowPostForm(false);
  };

  const handleClaimSuccess = () => {
    fetchItems();
    setClaimingItem(null);
  };

  if (showMessages) {
    return (
      <>
        <Navbar logout={logout} role="Student" onShowMessages={() => setShowMessages(false)} onPostItem={() => setShowPostForm(true)} />
        <MessagesList token={token} onClose={() => setShowMessages(false)} />
      </>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar
        logout={logout}
        role="Student"
        onShowMessages={() => setShowMessages(true)}
        onPostItem={() => setShowPostForm(!showPostForm)}
      />

      <div className="dashboard-form-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
  <div className="dashboard-form-container">
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        placeholder="Search for lost/found item"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  </div>
</div>


      {showPostForm && (
        <PostItemModal
          token={token}
          onClose={() => setShowPostForm(false)}
          onSuccess={handlePostSuccess}
        />
      )}

     <div style={{ width: '100%', borderTop: '1px solid #ccc', marginBottom: '10px' }}>
  <h3 style={{ display: 'flex', justifyContent: 'center', margin: 0, paddingBottom: '8px' }}>
    Reported Items
  </h3>
</div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="items-grid">
          {items.length === 0 && <p>No items found.</p>}
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h4>
                {item.imageUrl && (
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.title}
                    className="item-image"
                  />
                )}
                {item.title}{' '}
                {item.claimed && <span className="claimed-tag">(Claimed)</span>}
              </h4>
              <p><strong>Found at:</strong> {item.locationFound}</p>
            
              {!item.claimed && (
                <button
                  onClick={() => setClaimingItem(item)}
                  className="claim-button"
                >
                  Claim this item
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {claimingItem && (
        <ClaimForm
          token={token}
          item={claimingItem}
          onClose={() => setClaimingItem(null)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
