import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState({ bio: '', location: '' });
    const [editableProfile, setEditableProfile] = useState({ bio: '', location: '' });
    const [posts, setPosts] = useState([]); // State for user posts
 // Store the post ID to be deleted

    useEffect(() => {
        fetchProfile();
        fetchUserPosts(); // Fetch only the user's posts
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: token },
        });
        setProfile(response.data); // Set current profile for display
        setEditableProfile(response.data); // Populate editable fields initially
    };

    const fetchUserPosts = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/posts/my-posts', { // Updated endpoint
            headers: { Authorization: token },
        });
        setPosts(response.data); // Set the fetched posts into state
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const updatedData = { bio: editableProfile.bio, location: editableProfile.location };

        await axios.put(
            'http://localhost:5000/api/auth/profile',
            updatedData,
            { headers: { Authorization: token, 'Content-Type': 'application/json' } }
        );

        alert('Profile updated successfully');
        fetchProfile();
        setEditableProfile({ bio: '', location: '' });
    };

    const handleDeletePost = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
                headers: { Authorization: token },
            });
            setPosts(posts.filter(post => post._id !== postId)); // Remove the deleted post from the state
            alert('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('There was an error deleting the post.');
        }
    };

    return (
        <div className="container mt-5">
            <h3>My Profile</h3>

            <div className="mb-4">
                <p><strong>Bio:</strong> {profile.bio || "No bio available"}</p>
                <p><strong>Location:</strong> {profile.location || "No location available"}</p>
            </div>

            <h4>My Posts</h4>
            <div className="row">
                {posts.map((post) => (
                    <div key={post._id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.content}</p>
                                <p className="card-text">
                                    <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                                </p>
                                <p className="card-text">{post.likes.length} likes</p>
                                {/* Delete Button */}
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this post?')) {
                                            handleDeletePost(post._id);
                                        }
                                    }}
                                >
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h4>Edit My Info</h4>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        className="form-control"
                        value={editableProfile.bio}
                        onChange={(e) => setEditableProfile({ ...editableProfile, bio: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        className="form-control"
                        value={editableProfile.location}
                        onChange={(e) => setEditableProfile({ ...editableProfile, location: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
