import React from 'react';

const Navbar = ({
  logout,
  role,
  username,
  onShowMessages,
  onPostItem,
  onViewItems,
  onViewClaims,
  onViewReturns,
  onViewStats,
  isViewingClaims,
  isViewingReturns,
  isViewingStats
}) => {
  const baseButtonStyle = {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    marginLeft: '10px',
    cursor: 'pointer',
    fontFamily: "'Rubik', sans-serif",
    position: 'relative',
    backgroundColor: 'transparent',
    color: 'white',
  };

  const buttonStyles = {
    claim: {
      ...baseButtonStyle,
      backgroundColor: '#ff6600', // Orange
    },
    item: {
      ...baseButtonStyle,
      backgroundColor: '#007bff', // Blue
    },
    post: {
      ...baseButtonStyle,
      backgroundColor: '#ff6600', // Orange
    },
    message: {
      ...baseButtonStyle,
      backgroundColor: '#6c757d', // Gray
    },
    logout: {
      ...baseButtonStyle,
      backgroundColor: '#dc3545', // Red
    },
    returns: {
      ...baseButtonStyle,
      backgroundColor: '#28a745', // Green
    },
    stats: {
      ...baseButtonStyle,
      backgroundColor: '#6f42c1', // Purple
    }
  };

  return (
    <nav
      style={{
        padding: '10px',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      {/* Embedded CSS for hover bar */}
      <style>{`
        .hover-button {
          position: relative;
          transition: all 0.3s ease;
        }

        .hover-button::before,
        .hover-button::after {
          content: '';
          position: absolute;
          left: 0;
          width: 0%;
          height: 3px;
          background-color: white;
          transition: width 0.3s ease;
        }

        .hover-button::before {
          top: 0px;
        }

        .hover-button::after {
          bottom: 0px;
        }

        .hover-button:hover::before,
        .hover-button:hover::after {
          width: 100%;
        }

        .hover-button:hover {
          filter: brightness(100%);
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            marginRight: '20px',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: role === 'Admin' ? '#007BFF' : '#FF6600',
          }}
        >
          UNZA Lost and Found
        </span>
        <span style={{ marginRight: '20px' }}>Welcome: {role}</span>
      </div>

      <div>
        {role === 'Admin' ? (
          <>
            <button 
              className="hover-button" 
              style={buttonStyles.item} 
              onClick={onViewItems}
              disabled={!isViewingClaims && !isViewingReturns && !isViewingStats}
            >
              View Items
            </button>
            <button 
              className="hover-button" 
              style={buttonStyles.claim} 
              onClick={onViewClaims}
              disabled={isViewingClaims && !isViewingReturns && !isViewingStats}
            >
              View Claims
            </button>
            <button 
              className="hover-button" 
              style={buttonStyles.returns} 
              onClick={onViewReturns}
              disabled={isViewingReturns && !isViewingClaims && !isViewingStats}
            >
              Return History
            </button>
            <button 
              className="hover-button" 
              style={buttonStyles.stats} 
              onClick={onViewStats}
              disabled={isViewingStats}
            >
              Platform Stats
            </button>
          </>
        ) : (
          <>
            <button className="hover-button" style={buttonStyles.post} onClick={onPostItem}>
              Post Item
            </button>
            <button className="hover-button" style={buttonStyles.message} onClick={onShowMessages}>
              Messages
            </button>
          </>
        )}
        <button className="hover-button" style={buttonStyles.logout} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;