const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Assuming Post model is defined
const auth = require('../middleware/auth'); // Ensure user is authenticated

// Route to create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content cannot be empty.' });
    }

    const newPost = new Post({
      content,
      user: req.user.id, // Set in auth middleware
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error in saving post:", error);
    res.status(500).json({ error: 'Error saving post' });
  }
});

// Fetch posts excluding user's own posts
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure user ID is retrieved from auth middleware
    const posts = await Post.find({ user: { $ne: userId } }).populate('user', 'username');
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send('Server Error');
  }
});

// Route to get only the posts from the logged-in user
router.get('/my-posts', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ user: userId }).populate('user', 'username');
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).send('Server Error');
  }
});

// Like or unlike a post
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      // If liked, unlike it
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // If not liked, like it
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post); // Respond with updated post
  } catch (err) {
    console.error("Error liking/unliking post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Unlike a post
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const userId = req.user.id;
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "Post not liked yet." });
    }

    post.likes = post.likes.filter(id => id.toString() !== userId);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Error unliking post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE route to delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the post by its ID
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure that the logged-in user is the one who created the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    // Use deleteOne or findByIdAndDelete
    await Post.findByIdAndDelete(req.params.id); // This will delete the post by its ID
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
