import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [shareModal, setShareModal] = useState({ isOpen: false, postId: null });
  const [toUsername, setToUsername] = useState('');
  const [shareError, setShareError] = useState('');
  const [createPostModal, setCreatePostModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [postError, setPostError] = useState('');
  const [updateModal, setUpdateModal] = useState({ isOpen: false, postId: null, content: '' });
  const [updateError, setUpdateError] = useState('');
  const [userStats, setUserStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserStats();
    }
  }, [currentUser]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/stats', {
        credentials: 'include'
      });
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

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

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        credentials: 'include'
      });

      if (response.status === 401) {
        navigate('/');
        return;
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setPosts(posts.map(post => {
          if (post.PostID === postId) {
            return { ...post, LikeCount: post.LikeCount + 1 };
          }
          return post;
        }));
        fetchUserStats();
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setPosts(posts.map(post => {
          if (post.PostID === postId) {
            return { ...post, LikeCount: post.LikeCount - 1 };
          }
          return post;
        }));
        fetchUserStats();
      }
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  const handleSharesClick = () => {
    navigate('/shared-posts');
  };

  const handleShare = async (postId) => {
    setShareModal({ isOpen: true, postId });
    setShareError('');
    setToUsername('');
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    setShareError('');

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${shareModal.postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ toUsername })
      });

      if (response.ok) {
        setPosts(posts.map(post => {
          if (post.PostID === shareModal.postId) {
            return { ...post, ShareCount: post.ShareCount + 1 };
          }
          return post;
        }));
        setShareModal({ isOpen: false, postId: null });
        fetchUserStats();
      } else {
        const data = await response.json();
        setShareError(data.error || 'Failed to share post');
      }
    } catch (error) {
      setShareError('Failed to share post');
    }
  };

  const handleCreatePostClick = () => {
    setCreatePostModal(true);
    setPostError('');
    setNewPost('');
  };

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    setPostError('');

    try {
        const response = await fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: newPost })
        });

        const data = await response.json();

        if (response.ok) {
            await fetchPosts();
            setCreatePostModal(false);
            setNewPost('');
            fetchUserStats();
        } else {
            setPostError(data.error);
        }
    } catch (error) {
        setPostError('Failed to create post');
    }
  };

  const handleUpdate = (post) => {
    setUpdateModal({ 
      isOpen: true, 
      postId: post.PostID,
      content: post.Content 
    });
    setUpdateError('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${updateModal.postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: updateModal.content })
        });

        const data = await response.json();

        if (response.ok) {
            await fetchPosts();
            setUpdateModal({ isOpen: false, postId: null, content: '' });
        } else {
            setUpdateError(data.error);
        }
    } catch (error) {
        setUpdateError('Failed to update post');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
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
        <h1>YikYak</h1>
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

      <div className="action-buttons">
        <button onClick={handleCreatePostClick} className="create-post-button">
          Create Post
        </button>
        <button onClick={handleSharesClick} className="shares-button">
          Shared w/Me
        </button>
        <button className="notifications-button">
          Notifications
        </button>
        <div className="user-stats-box">
          <h3>Your Stats</h3>
          {userStats && (
            <>
              <div className="stat-item">
                <span className="stat-label">Total Posts</span>
                <span className="stat-value">{userStats.TotalPosts}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Likes</span>
                <span className="stat-value">{userStats.TotalLikesReceived}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Shares</span>
                <span className="stat-value">{userStats.TotalSharesReceived}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="main-feed">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {posts.map(post => (
          <div key={post.PostID} className="post-card">
            <p>{post.Content}</p>
            <div className="post-metrics">
              <div className="like-section">
                <span>Likes: {post.LikeCount}</span>
                <button onClick={() => handleLike(post.PostID)} className="like-button">
                  Like
                </button>
                <button onClick={() => handleUnlike(post.PostID)} className="unlike-button">
                  Unlike
                </button>
              </div>
              <div className="share-section">
                <span>Shares: {post.ShareCount}</span>
                <button onClick={() => handleShare(post.PostID)} className="share-button">
                  Share
                </button>
                {currentUser && post.UserID === currentUser.UserID && (
                  <button onClick={() => handleUpdate(post)} className="update-button">
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {shareModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Share Post</h3>
            {shareError && <div className="error-message">{shareError}</div>}
            <form onSubmit={handleShareSubmit}>
              <input
                type="text"
                placeholder="Enter username to share with"
                value={toUsername}
                onChange={(e) => setToUsername(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Share</button>
                <button type="button" onClick={() => setShareModal({ isOpen: false, postId: null })}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {createPostModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Post</h3>
            {postError && <div className="error-message">{postError}</div>}
            <form onSubmit={handleCreatePostSubmit}>
              <textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                maxLength={280}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Post</button>
                <button type="button" onClick={() => setCreatePostModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {updateModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Post</h3>
            {updateError && <div className="error-message">{updateError}</div>}
            <form onSubmit={handleUpdateSubmit}>
              <textarea
                value={updateModal.content}
                onChange={(e) => setUpdateModal({...updateModal, content: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setUpdateModal({ isOpen: false, postId: null, content: '' })}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;