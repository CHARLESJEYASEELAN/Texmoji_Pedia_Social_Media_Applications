import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const lightColors = ['#f0f8ff', '#e6f7ff', '#ffe4e1', '#f5f5dc', '#fafad2'];

  const toggleModal = () => setShowModal(!showModal);

  const fetchPosts = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/posts?page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
        setPage(pageNumber + 1);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        { content: postContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setPosts([response.data, ...posts]);
        setShowModal(false);
        setPostContent('');
      }
    } catch (error) {
      alert('Error adding post: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
      if (hasMore && !loading) fetchPosts(page);
    }
  }, [hasMore, loading, fetchPosts, page]);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Assuming the backend returns the updated post with like count, we can update it here.
      const updatedPosts = posts.map(post => post._id === postId ? response.data : post);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div style={{
        width: '60%',
        padding: '20px',
        backgroundColor: '#afe3f5',
        border: '1px solid #ddd',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5em', color: 'black', margin: '0' }}>TexmojiPedia Feed</h1>
        <p style={{ fontSize: '1.2em', color: 'black', marginTop: '10px' }}>
          This is the main page where users can see posts.
        </p>
        <button onClick={toggleModal} style={{ marginTop: '20px', padding: '10px 20px' }}>Add Post</button>

        {/* Modal Overlay */}
        {showModal && <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: '999'
        }} onClick={toggleModal} />}

        {/* Modal for Adding Post */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            maxWidth: '500px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            padding: '20px',
            zIndex: '1000'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Create a New Post</h3>
            <form onSubmit={handleAddPost}>
              <textarea
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  marginBottom: '15px',
                  fontSize: '1em'
                }}
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '5px',
                  fontSize: '1em',
                  cursor: 'pointer'
                }}
              >
                Add Post
              </button>
              <button
                type="button"
                onClick={toggleModal}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  borderRadius: '5px',
                  fontSize: '1em',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Post List */}
        <div style={{ marginTop: '30px' }}>
          {posts.map((post, index) => (
            <div key={index} style={{
              backgroundColor: lightColors[index % lightColors.length],
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px',
              textAlign: 'left',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: '#666',
                fontSize: '0.9em'
              }}>{post.user.username}</span>

              <p style={{ marginTop: '10px' }}>{post.content}</p>
              <small style={{ color: '#888' }}>{new Date(post.createdAt).toLocaleString()}</small>

              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => handleLike(post._id)}
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '1em',
                  }}
                >
                  Like
                </button>
                <span style={{ marginLeft: '10px', fontSize: '0.9em' }}>
                  {post.likes ? `${post.likes} likes` : '0 likes'}
                </span>
              </div>
            </div>
          ))}
          {loading && <p>Loading...</p>}
          {!hasMore && <p>No more posts.</p>}
        </div>
      </div>
    </div>
  );
};

export default Feed;
