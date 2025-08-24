import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApprovedReturnsList = ({ token }) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/returns', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReturns(res.data);
      } catch (err) {
        console.error('Failed to fetch approved returns:', err);
      }
      setLoading(false);
    };

    fetchReturns();
  }, [token]);

  if (loading) return <p>Loading approved returns...</p>;

  return (
    <div className="returns-list">
      <h3>Approved Returns History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Student ID</th>
            <th>Contact</th>
            <th>Approved By</th>
          </tr>
        </thead>
        <tbody>
          {returns.map(ret => (
            <tr key={ret._id}>
              <td>{new Date(ret.approvedDate).toLocaleDateString()}</td>
              <td>{ret.itemTitle}</td>
              <td>{ret.studentId}</td>
              <td>{ret.contact}</td>
              <td>{ret.approvedBy?.username || 'System'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedReturnsList;