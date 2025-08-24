import React from 'react';
import PostItemForm from './PostItemForm';
import '../App.css';

const PostItemModal = ({ token, onClose, onSuccess }) => {
  return (
    <div className="claim-overlay">
      <div className="claim-modal">
        <h3>Post New Lost/Found Item</h3>
        <PostItemForm token={token} onSuccess={onSuccess} />
        <button type="button"  onClick={onClose} className='log-out-button'>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostItemModal;
