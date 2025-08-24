import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import ReplyForm from './ReplyForm';
import AdminStats from './AdminStats';
import ReturnHistory from './ReturnHistory';
import '../App.css';

const AdminDashboard = ({ logout, token }) => {
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [viewingClaims, setViewingClaims] = useState(false);
  const [viewingReturns, setViewingReturns] = useState(false);
  const [viewingStats, setViewingStats] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [returnedCount, setReturnedCount] = useState(0);
  const [returns, setReturns] = useState([]);

  const fetchAllData = async () => {
    try {
      setLoadingItems(true);
      setLoadingClaims(true);
      
      const [itemsRes, claimsRes, returnsRes, countRes] = await Promise.all([
        axios.get('http://localhost:5000/api/items', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/claims', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/returns', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/returns/count', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setItems(itemsRes.data);
      setClaims(claimsRes.data);
      setReturns(returnsRes.data);
      setReturnedCount(countRes.data.count);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoadingItems(false);
      setLoadingClaims(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(item => item._id !== id));
      setClaims(prev => prev.filter(claim => claim.item?._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
      fetchAllData();
    }
  };
  const handleRejectClaim = async (claimId, itemId) => {
  try {
    await axios.patch(`http://localhost:5000/api/claims/${claimId}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Update local state
    setClaims(prev => prev.filter(c => c._id !== claimId));
    setItems(prev => prev.map(item => 
      item._id === itemId ? { ...item, claimed: false } : item
    ));
  } catch (err) {
    console.error('Failed to reject claim:', err);
  }
};

  const handleApproveClaim = async (itemId, claimId) => {
    try {
      const claim = claims.find(c => c._id === claimId);
      const item = items.find(i => i._id === itemId);

      const returnResponse = await axios.post('http://localhost:5000/api/returns', {
        itemId,
        itemTitle: item?.title || 'Unknown Item',
        studentId: claim?.studentId || 'unknown',
        contactInfo: claim?.phone || '',
        claimDetails: claim?.detail || '',
        itemImageUrl: item?.imageUrl || null,
        approvedAt: new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Promise.all([
        axios.delete(`http://localhost:5000/api/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.delete(`http://localhost:5000/api/claims/${claimId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setItems(prev => prev.filter(item => item._id !== itemId));
      setClaims(prev => prev.filter(claim => claim._id !== claimId));
      setReturns(prev => [returnResponse.data, ...prev]);
      setReturnedCount(prev => prev + 1);
    } catch (err) {
      console.error('Approve claim error:', err);
      fetchAllData();
    }
  };

  const handleReply = (claim) => {
    setReplyingTo(claim);
  };

  const handleSendMessage = async (message) => {
    try {
      await axios.post('http://localhost:5000/api/replies', {
        message,
        studentTag: replyingTo.studentId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleViewItems = () => {
    setViewingClaims(false);
    setViewingReturns(false);
    setViewingStats(false);
  };

  const handleViewClaims = () => {
    setViewingClaims(true);
    setViewingReturns(false);
    setViewingStats(false);
  };

  const handleViewReturns = () => {
    setViewingReturns(true);
    setViewingClaims(false);
    setViewingStats(false);
  };

  const handleViewStats = () => {
    setViewingStats(true);
    setViewingClaims(false);
    setViewingReturns(false);
  };

  return (
    <div className="dashboard-container admin-dashboard-container">
      <Navbar
        logout={logout}
        role="Admin"
        onViewItems={handleViewItems}
        onViewClaims={handleViewClaims}
        onViewReturns={handleViewReturns}
        onViewStats={handleViewStats}
        isViewingClaims={viewingClaims}
        isViewingReturns={viewingReturns}
        isViewingStats={viewingStats}
      />
      
      {viewingStats && <AdminStats token={token} returnedCount={returnedCount} />}

      {!viewingClaims && !viewingReturns && !viewingStats ? (
        <>
          <h2 className="dashboard-section-title">All Items</h2>
          {loadingItems ? (
            <p>Loading items...</p>
          ) : (
            <div style={cardListStyle}>
              {items.length === 0 ? (
                <p>No items found.</p>
              ) : (
                items.map(item => (
                  <div key={item._id} style={cardStyle}>
                    <div style={imageContainerStyle}>
                      <img
                        src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://via.placeholder.com/100'}
                        alt={item.title}
                        style={imageStyle}
                      />
                    </div>
                    <div style={cardContentStyle}>
                      <div style={cardTextStyle}>
                        <h4>{item.title} {item.claimed && <span className="claimed-tag">(Claimed)</span>}</h4>
                        <p><strong>Location Found:</strong> {item.locationFound}</p>
                        <p><strong>Contact:</strong> {item.contactInfo}</p>
                      </div>
                      <div style={cardButtonWrapperStyle}>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      ) : viewingClaims ? (
        <>
          <h2 className="dashboard-section-title">Submitted Claims</h2>
          {loadingClaims ? (
            <p>Loading claims...</p>
          ) : (
            <div style={cardListStyle}>
              {claims.filter(claim => claim.item).length === 0 ? (
                <p>No claims found.</p>
              ) : (
                claims.filter(claim => claim.item).map(claim => (
                  <div key={claim._id} style={cardStyle}>
                    <div style={imageContainerStyle}>
                      <img
                        src={claim.item.imageUrl ? `http://localhost:5000${claim.item.imageUrl}` : 'https://via.placeholder.com/100'}
                        alt={claim.item.title}
                        style={imageStyle}
                      />
                    </div>
                    <div style={cardContentStyle}>
                      <div style={cardTextStyle}>
                        <h4>{claim.item.title}</h4>
                        <p><strong>Description:</strong> {claim.detail}</p>
                        <p><strong>Student ID:</strong> {claim.studentId}</p>
                        <p><strong>Contact:</strong> {claim.phone}</p>
                      </div>
                      <div style={cardButtonWrapperStyle}>
                        <button
                          className="approve-button"
                          onClick={() => handleApproveClaim(claim.item._id, claim._id)}
                          style={{ marginRight: '10px' }}
                        >
                          Approve Return
                        </button>
                        <button
  className="reject-button"
  onClick={() => handleRejectClaim(claim._id, claim.item._id)}
  style={{ marginRight: '10px' }}
>
  Reject Claim
</button>
                        <button
                          className="reply-button"
                          onClick={() => handleReply(claim)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      ) : viewingReturns ? (
        <div className="return-history-section">
          <h2 className="dashboard-section-title">Return History</h2>
          <div className="return-history-grid">
            {returns.map(returnItem => (
              <div key={returnItem._id} className="return-history-card">
                <div className="return-history-content">
                  <h4>Item: {returnItem.itemTitle}</h4>
                  <p><strong>Claimed by Student:</strong> {returnItem.studentId}</p>
                  <p><strong>Contact:</strong> {returnItem.contactInfo}</p>
                  <p><strong>Claim Details:</strong> {returnItem.claimDetails}</p>
                  <p className="return-date">
                    <strong>Return Approved:</strong> {new Date(returnItem.approvedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {replyingTo && (
        <ReplyForm
          recipient={replyingTo.studentId}
          onClose={() => setReplyingTo(null)}
          onSend={handleSendMessage}
        />
      )}

      <style jsx>{`
        .return-history-section {
          margin-top: 40px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        
        .return-history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .return-history-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s;
        }
        
        .return-history-card:hover {
          transform: translateY(-2px);
        }
        
        .return-history-content {
          padding: 15px;
        }
        
        .return-history-content h4 {
          margin-top: 0;
          color: #333;
        }
        
        .return-date {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 10px;
        }
        
        .return-history-content p {
          margin: 5px 0;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

const cardListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  padding: '10px',
};

const cardStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '1450px',
};

const imageContainerStyle = {
  marginRight: '15px',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
};

const imageStyle = {
  width: '100px',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
};

const cardContentStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const cardTextStyle = {
  flex: 1,
};

const cardButtonWrapperStyle = {
  display: 'flex',
  alignItems: 'center', 
  justifyContent: 'flex-end',
};

export default AdminDashboard;