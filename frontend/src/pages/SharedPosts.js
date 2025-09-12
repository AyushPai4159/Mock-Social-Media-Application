import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feed.css';

function SharedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSharedPosts();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchSharedPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts/shared-with-me', {
        credentials: 'include'
      });

      if (response.status === 401) {
        navigate('/');
        return;
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError('Failed to load shared posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Failed to connect to server');
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${currentUser.UserID}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          navigate('/');
        } else {
          console.error('Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div className="feed-layout">
      <div className="feed-header">
        <h1>Shared With Me</h1>
        <button onClick={() => navigate('/feed')} className="back-button">
          Back to Feed
        </button>
      </div>
  
      <div className="user-info-box">
        <h3>Current User</h3>
        {currentUser && (
          <>
            <p>{currentUser.Username}</p>
            <div className="user-actions">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
              <button onClick={handleDeleteAccount} className="delete-account-button">
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>
  
      <div className="main-feed">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {posts.map(post => (
          <div key={post.PostID} className="post-card">
            <p className="post-content">{post.Content}</p>
            <div className="post-info">
              <div className="share-details">
                <span className="shared-by">Shared by: {post.SharedBy}, </span>
                <span className="shared-at">Shared at: {new Date(post.SharedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
        {!loading && posts.length === 0 && (
          <div className="no-posts">No posts have been shared with you yet.</div>
        )}
      </div>
    </div>
  );
}

export default SharedPosts;