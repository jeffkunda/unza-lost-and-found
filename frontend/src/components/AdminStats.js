import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = ({ token, returnedCount }) => {
  const [stats, setStats] = useState({ 
    items: 0, 
    claims: 0, 
    replies: 0,
    returnedItems: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [itemsRes, claimsRes, repliesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/items', config),
          axios.get('http://localhost:5000/api/claims', config),
          axios.get('http://localhost:5000/api/replies', config),
        ]);

        setStats({
          items: itemsRes.data?.length || 0,
          claims: claimsRes.data?.length || 0,
          replies: repliesRes.data?.length || 0,
          returnedItems: returnedCount
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(
          err.response?.status === 403
            ? 'Access denied. Check if your token is valid.'
            : 'Failed to load stats. Ensure the backend is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token, returnedCount]);

  const maxValue = Math.max(stats.items, stats.claims, stats.replies, stats.returnedItems, 1);

  if (loading) return <div className="stats-loading">Loading statistics...</div>;
  if (error) return <div className="stats-error">{error}</div>;

  return (
    <div className="stats-container">
      <h3>Platform Statistics</h3>
      <div className="stats-bar-chart">
        <div className="stat-item">
          <div className="stat-label">listed Items</div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar" 
              style={{ 
                width: `${(stats.items / maxValue) * 100}%`,
                backgroundColor: '#4285f4'
              }}
            ></div>
          </div>
          <div className="stat-value">{stats.items}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">submitted claims</div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar" 
              style={{ 
                width: `${(stats.claims / maxValue) * 100}%`,
                backgroundColor: '#ea4335'
              }}
            ></div>
          </div>
          <div className="stat-value">{stats.claims}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">sent replies</div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar" 
              style={{ 
                width: `${(stats.replies / maxValue) * 100}%`,
                backgroundColor: '#fbbc05'
              }}
            ></div>
          </div>
          <div className="stat-value">{stats.replies}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Returned items</div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar" 
              style={{ 
                width: `${(stats.returnedItems / maxValue) * 100}%`,
                backgroundColor: '#34a853'
              }}
            ></div>
          </div>
          <div className="stat-value">{stats.returnedItems}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;