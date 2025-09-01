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
  const [categoryFilter, setCategoryFilter] = useState('');
  const [claimingItem, setClaimingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to get the display text based on category
  const getCategoryDisplayText = () => {
    if (categoryFilter === 'electronics') return 'Reported Electronic Devices';
    if (categoryFilter === 'clothing') return 'Reported Clothing Items';
    if (categoryFilter === 'bag') return 'Reported Bags';
    if (categoryFilter === 'id') return 'Reported ID/Documents';
    if (categoryFilter === 'studentid') return 'Reported Student IDs';
    if (categoryFilter === 'wallet') return 'Reported Wallets';
    if (categoryFilter === 'keys') return 'Reported Keys';
    return 'Reported Items'; // Default text
  };

  const fetchItems = async (query = '', category = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/items/search';
      const params = new URLSearchParams();
      
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      
      // Always use the search endpoint, even if no params
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sortedItems = res.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setItems(sortedItems);
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
    fetchItems(searchQuery, categoryFilter);
  };

  const handleCategoryClick = (category) => {
    const newCategory = category === categoryFilter ? '' : category;
    setCategoryFilter(newCategory);
    fetchItems(searchQuery, newCategory);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    fetchItems();
  };

  const handlePostSuccess = () => {
    fetchItems();
    setShowPostForm(false);
  };

  const handleClaimSuccess = () => {
    fetchItems();
    setClaimingItem(null);
  };

  const openImageModal = (imageUrl, title) => {
    setSelectedImage({ imageUrl, title });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
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

      <div className="dashboard-form-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div className="dashboard-form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <form onSubmit={handleSearch} className="search-form" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '15px' }}>
            <div style={{ display: 'flex', maxWidth: '500px', width: '100%' }}>
              <input
                type="text"
                placeholder="Search for lost/found item"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ flex: 1, marginRight: '10px' }}
              />
              <button type="submit" className="search-button">Search</button>
            </div>
            {(searchQuery || categoryFilter) && (
              <button type="button" onClick={handleClearFilters} className="clear-button" style={{ marginLeft: '10px' }}>
                Clear Filters
              </button>
            )}
          </form>
          
          {/* Category buttons row */}
          <div className="category-buttons-container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', width: '100%' }}>
            <button 
              className={`category-button ${categoryFilter === 'electronics' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('electronics')}
            >
              Electronics
            </button>
            <button 
              className={`category-button ${categoryFilter === 'clothing' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('clothing')}
            >
              Clothing
            </button>
            <button 
              className={`category-button ${categoryFilter === 'bag' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('bag')}
            >
              Bags
            </button>
            <button 
              className={`category-button ${categoryFilter === 'id' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('id')}
            >
              ID/Documents
            </button>
            <button 
              className={`category-button ${categoryFilter === 'studentid' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('studentid')}
            >
              Student ID
            </button>
            <button 
              className={`category-button ${categoryFilter === 'wallet' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('wallet')}
            >
              Wallet
            </button>
            <button 
              className={`category-button ${categoryFilter === 'keys' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('keys')}
            >
              Keys
            </button>
          </div>
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
          {getCategoryDisplayText()}
        </h3>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div className="items-grid">
          {items.length === 0 && <p style={{ textAlign: 'center' }}>No items found.</p>}
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h4>
                {item.imageUrl && (
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.title}
                    className="item-image"
                    onClick={() => openImageModal(`http://localhost:5000${item.imageUrl}`, item.title)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                {item.title}{' '}
                {item.claimed && <span className="claimed-tag">(Claimed)</span>}
              </h4>
              <p><strong>Found at:</strong> {item.locationFound}</p>
              
              <button
                onClick={() => !item.claimed && setClaimingItem(item)}
                className={`claim-button ${item.claimed ? 'claimed-button' : ''}`}
                disabled={item.claimed}
              >
                {item.claimed ? 'Already Claimed' : 'Claim this item'}
              </button>
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

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeImageModal}>&times;</span>
            <img src={selectedImage.imageUrl} alt={selectedImage.title} className="enlarged-image" />
            <p className="image-title">{selectedImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;