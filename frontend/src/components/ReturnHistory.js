import React from 'react';

const ReturnHistory = ({ returns }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="return-history-container">
      <h3>Return History</h3>
      {returns.length === 0 ? (
        <p>No returns found.</p>
      ) : (
        <div style={cardListStyle}>
          {returns.map(returnItem => (
            <div key={returnItem._id} style={cardStyle}>
              <div style={imageContainerStyle}>
                <img
                  src={returnItem.item?.imageUrl ? `http://localhost:5000${returnItem.item.imageUrl}` : 'https://via.placeholder.com/100'}
                  alt={returnItem.itemTitle}
                  style={imageStyle}
                />
              </div>
              <div style={cardContentStyle}>
                <div style={cardTextStyle}>
                  <h4>{returnItem.itemTitle}</h4>
                  <p><strong>Student ID:</strong> {returnItem.studentId}</p>
                  <p><strong>Contact:</strong> {returnItem.contactInfo}</p>
                  <p><strong>Description:</strong> {returnItem.claimDetails}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Keep the same style objects as before
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

export default ReturnHistory;